# 动态代理连接与 Session 参数

本文说明连接格式，不是连通性或性能验收报告。示例中的账号、密码、网关域名和端口仅供展示；实际连接使用账号查询结果或网站提供的信息，不能把示例凭据直接用于真实请求。

命令示例采用 Bash 引号写法；Windows cmd 应使用双引号引用完整代理参数。引号用于让命令行保留空格，不是用户名或地区字段本身的一部分。

## （Session）使用说明

### 基本格式

```
{账号}-ss-{随机值}:{密码}@proxy.quanqiudaili.com:5001
```

在账号后面拼接参数即可控制国家、时长、会话等，密码不变。

**完整参数格式：**
```
{账号}-cty-{国家}-st-{州/省}-ct-{城市}-ss-{会话ID}-tm-{ip时长}-spec-{资源池}:{密码}@proxy.quanqiudaili.com:5001
```

### 参数说明

| 参数 | 含义 | 是否必填 | 说明 |
|------|------|----------|------|
| 账号 | 子账号名 | **必填**，且必须在第一位 | 如 `apitest-1` |
| cty | 国家代码 | 可选 | 如 `US`、`TW`、`JP`；省略时按子账号的默认地区设置处理，不能仅凭省略参数承诺全球随机。 |
| st | 州/省 | 可选 | 需先指定国家才生效；含空格时按当前命令行规则引用参数，如 `New York`。 |
| ct | 城市 | 可选 | 需先指定国家才生效；含空格时按当前命令行规则引用参数，如 `Los Angeles`。 |
| ss | 会话ID | 可选 | **核心参数**，不同的 ss 值 = 不同的IP会话，详见下方说明 |
| tm | IP在线时长 | 可选 | 带单位：`s`(秒)、`m`(分钟)、`h`(小时) |
| spec | 资源池 | 可选 | 可选值：`4` 或 `284`，不指定则使用默认资源池 |

> **除了账号必须在第一个位置上，其他字段位置随意，所有字段都是可选的，不指定则按照子账号原本的参数执行。**
>
> **如果指定时长内分配的ip掉线，为保障请求网络可用性，系统会自动为您切换到其它IP。**

---

### 从简单到复杂：逐步上手

**第1步：最基本的代理请求**
```bash
curl -x apitest-1-ss-r4nd0m1:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**第2步：指定IP在线时长10分钟**
```bash
curl -x apitest-1-tm-10m-ss-r4nd0m2:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**第3步：指定国家 + IP在线时长10分钟**
```bash
curl -x apitest-1-cty-US-tm-10m-ss-r4nd0m3:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**第4步：需要5条美国的10分钟代理会话 —— 每条指定不同的 ss 值**
```bash
curl -x apitest-1-cty-US-tm-10m-ss-456321sss:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
curl -x apitest-1-cty-US-tm-10m-ss-456322sad:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
curl -x apitest-1-cty-US-tm-10m-ss-456323231:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
curl -x apitest-1-cty-US-tm-10m-ss-456322111:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
curl -x apitest-1-cty-US-tm-10m-ss-456322222:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```
> 不同 `ss` 将请求分为5个会话，期望各自保持10分钟；不保证出口 IP 绝对不重复，节点掉线时仍可能提前切换。

---

### ss 会话参数详解（重点）

**ss 用于区分同一子账号下的代理会话。更换 ss 不会创建新的业务子账号，也不需要调用新增子账号工具。**

- 不同 `ss` 值用于区分会话，不保证它们的出口 IP 绝对不同。
- 在 `tm` 指定的时长内，相同 `ss` 值用于尽量复用同一 IP；节点掉线时系统仍会切换。
- 到期后自动切换新IP，但该 `ss` 会话仍然保持
- **如果需要同时使用多个IP，必须使用不同的 `ss` 值**

> **⚠️ 重要规则：**
> - 如果每次请求都想换IP（一次一换），**不要带 ss 参数**
> - 如果需要在指定时长内尽量保持 IP，**ss 参数必填**，且不同会话必须使用不同的 ss 值。
> - 简单记忆：**不带 ss = 轮换模式，带 ss = 粘性会话；粘性会话也可能因节点掉线提前换 IP。**

#### ❌ 错误用法：多个会话使用相同的 ss 值

```bash
curl -x apitest-1-cty-US-st-Pennsylvania-ct-'Lehighton'-tm-30m-ss-zaHJiS:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
curl -x apitest-1-cty-TW-tm-30m-ss-zaHJiS:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```
> 问题：两个请求使用了相同的 `ss-zaHJiS`，会导致会话冲突，IP不能正确隔离。

#### ✅ 正确用法：每个会话使用不同的 ss 值

**示例：同一地区同时需要3个独立会话**

第一个30分钟的IP会话：
```bash
curl -x apitest-1-cty-US-st-Pennsylvania-ct-'Lehighton'-tm-30m-ss-1z12ad2:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

第二个30分钟的IP会话：
```bash
curl -x apitest-1-cty-US-st-Pennsylvania-ct-'Lehighton'-tm-30m-ss-1z5cade:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

第三个30分钟的IP会话：
```bash
curl -x apitest-1-cty-US-st-Pennsylvania-ct-'Lehighton'-tm-30m-ss-1c5cgdf:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

> 每个 `ss` 值不同，因此使用3个会话；实际出口 IP 可能重复，不能据此承诺3个不同 IP。

---

### 通过 tm 参数灵活控制在线时长

不再需要批量修改IP在线时长，直接在请求中通过 `tm` 参数指定即可，更加灵活方便。

**示例：将在线时长设为20分钟**

第一个IP（在线20分钟，到期自动切换）：
```bash
curl -x apitest-1-cty-US-ss-456321sss-tm-20m-spec-4:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

第二个IP（在线20分钟，到期自动切换）：
```bash
curl -x apitest-1-cty-US-ss-12345678-tm-20m-spec-4:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

> 更换 `ss` 可使用新会话，无需修改子账号配置；新会话不保证分配不同的出口 IP。

---

### 常用场景示例

> 部分州/省、城市名称含有空格（如 `New York`、`Los Angeles`），应按所用命令行的规则引用代理参数，避免被拆成多个参数。以下 Bash 示例可以写成 `st-'New York'`，实际发送的地区值不包含引号。

**1. 指定国家+州+城市，30分钟切换**
```bash
curl -x apitest-1-cty-US-st-Pennsylvania-ct-'Lehighton'-tm-30m-ss-abc123:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**2. 只指定国家，30分钟切换**
```bash
curl -x apitest-1-cty-TW-tm-30m-ss-def456:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**3. 指定美国纽约，1分钟切换**
```bash
curl -x apitest-1-cty-US-st-'New York'-ss-123333-tm-1m:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**4. 指定资源池284，美国弗罗里达，2分钟切换**
```bash
curl -x apitest-1-cty-US-st-Florida-spec-284-ss-123444-tm-2m:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**5. 沿用默认地区，1分钟切换**
```bash
curl -x apitest-1-ss-126643-tm-1m:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**6. 使用284资源池，沿用默认地区与轮换设置**
```bash
curl -x apitest-1-spec-284:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**7. 沿用默认地区，5分钟切换一次**
```bash
curl -x apitest-1-tm-5m-ss-a3x7kp9:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**8. 不带 ss，实现IP一次一换（每次请求换IP）**
```bash
curl -x apitest-1-cty-US-tm-1m:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**9. 不带地区参数，沿用默认地区设置**
```bash
curl -x apitest-1-ss-789012-tm-5m:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

---

### 资源池选择与验证范围

使用 `spec-4` 或 `spec-284` 指定资源池，不指定则使用默认配置。地区可用性和连接结果以当前账号及实际请求为准；需要全球随机时，先核对子账号的默认地区设置。

本规范不提供可核实的实时容量、成功率或延迟数据，不能据此承诺 QPS、并发连接数或带宽。需要性能结论时，须记录测试日期、账号、资源池、地区、并发和目标站点后单独验证。
