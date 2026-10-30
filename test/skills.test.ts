import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';
import type { ToolDef } from '../src/types.js';

const root = fileURLToPath(new URL('../skills/quanqiudaili/', import.meta.url));
const read = (path: string): string => readFileSync(resolve(root, path), 'utf8');
const tools = JSON.parse(readFileSync(new URL('../spec/tools.json', import.meta.url), 'utf8')) as ToolDef[];
const toolNames = tools.map(tool => tool.name).sort();
const manifest = JSON.parse(read('references/tool-map.json')) as {
  schemaVersion: number;
  workflows: { id: string; reference: string; tools: string[] }[];
};
const fixtures = JSON.parse(readFileSync(new URL('./fixtures/skill-workflows.json', import.meta.url), 'utf8')) as {
  schemaVersion: number;
  cases: { id: string; workflow: string; tool: string; arguments: Record<string, unknown>; backendData: unknown }[];
};
const evaluations = JSON.parse(read('references/evaluation-scenarios.json')) as {
  schemaVersion: number;
  scenarios: {
    id: string;
    workflow: string;
    request: string;
    expected: { requiredTools: string[]; forbiddenTools: string[]; notes: string[] };
  }[];
};

/** 递归收集技能目录内的 Markdown 文件。
 *
 * @param directory 要检查的技能目录。
 * @return string[] 返回全部 Markdown 文件的绝对路径。
 */
function markdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(path) : entry.name.endsWith('.md') ? [path] : [];
  });
}

describe('全球代理业务技能包', () => {
  it('入口含可发现的名称和用途，所有工具各自归属一个可打开的工作流', () => {
    const frontmatter = read('SKILL.md').match(/^---\r?\n([\s\S]+?)\r?\n---/);
    expect(frontmatter).not.toBeNull();
    const metadata = parse(frontmatter![1]) as { name: string; description: string };
    expect(metadata.name).toBe('quanqiudaili');
    expect(metadata.description.length).toBeGreaterThan(0);
    expect(manifest.schemaVersion).toBe(1);
    expect(new Set(manifest.workflows.map(workflow => workflow.id)).size).toBe(manifest.workflows.length);

    const assigned = manifest.workflows.flatMap(workflow => workflow.tools);
    expect(assigned.slice().sort()).toEqual(toolNames);
    expect(new Set(assigned).size).toBe(assigned.length);
    for (const workflow of manifest.workflows) {
      const page = read(`references/${workflow.reference}`);
      expect(workflow.tools.length).toBeGreaterThan(0);
      // 工具归属必须能从该页找到，避免修改清单后技能仍无法发现用法。
      for (const name of workflow.tools) expect(page.includes(`\`${name}\``), name).toBe(true);
    }
  });

  it('技能内所有本地 Markdown 引用可随包读取，不逃逸到源仓库或开发机', () => {
    for (const file of markdownFiles(root)) {
      const content = readFileSync(file, 'utf8');
      for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
        const target = match[1].split('#')[0];
        if (!target || /^[a-z][a-z\d+.-]*:/i.test(target)) continue;
        expect(isAbsolute(target), `${file} -> ${target}`).toBe(false);
        const resolved = resolve(dirname(file), decodeURIComponent(target));
        const local = relative(root, resolved);
        expect(local === '..' || local.startsWith('../') || local.startsWith('..\\') || isAbsolute(local), target).toBe(false);
        expect(statSync(resolved).isFile(), `${file} -> ${target}`).toBe(true);
      }
    }
  });

  it('无 MCP resource 的客户端读到同一份 Session 规范', () => {
    expect(read('references/generated/dynamic-proxy-session.md')).toBe(
      readFileSync(new URL('../spec/dynamic-proxy-session.md', import.meta.url), 'utf8'),
    );
  });

  it('真实 stdio 测试素材为每个工具提供一个有归属的调用，不预置确认码', () => {
    expect(fixtures.schemaVersion).toBe(1);
    expect(fixtures.cases.map(item => item.tool).sort()).toEqual(toolNames);
    expect(new Set(fixtures.cases.map(item => item.id)).size).toBe(fixtures.cases.length);
    for (const item of fixtures.cases) {
      const workflow = manifest.workflows.find(value => value.id === item.workflow);
      expect(workflow?.tools, item.id).toContain(item.tool);
      expect(item.arguments, item.id).not.toHaveProperty('confirm_token');
      expect(item.arguments, item.id).not.toHaveProperty('token');
      expect(item.backendData, item.id).toBeDefined();
    }
  });

  it('行为评估案例只引用现有工作流与工具，要求与禁止动作不自相矛盾', () => {
    expect(evaluations.schemaVersion).toBe(1);
    expect(new Set(evaluations.scenarios.map(item => item.id)).size).toBe(evaluations.scenarios.length);
    for (const scenario of evaluations.scenarios) {
      expect(manifest.workflows.some(value => value.id === scenario.workflow), scenario.id).toBe(true);
      expect(scenario.request.length, scenario.id).toBeGreaterThan(0);
      expect(scenario.expected.notes.length, scenario.id).toBeGreaterThan(0);
      for (const name of [...scenario.expected.requiredTools, ...scenario.expected.forbiddenTools]) {
        expect(toolNames, scenario.id).toContain(name);
      }
      for (const name of scenario.expected.requiredTools) {
        expect(scenario.expected.forbiddenTools, scenario.id).not.toContain(name);
      }
    }
  });
});
