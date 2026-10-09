# 获取子账号流量上限

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/tool/accountLimitFlow:
    get:
      summary: 获取子账号流量上限
      deprecated: false
      description: 获取动态住宅（包月）子账号流量上限
      tags:
        - 用户IP子账号管理/动态住宅流量子账号 （包月）
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型id，此处固定类别为：6
          required: true
          example: 6
          schema:
            type: integer
        - name: id
          in: query
          description: 子账号id，取子账号列表返回的 id
          required: true
          example: 44
          schema:
            type: integer
        - name: token
          in: header
          description: 用户api key。<a href="/9518262m0" target="_blank">api key获取方式</a>
          required: false
          example: '{{access_token}}'
          schema:
            type: string
      requestBody:
        content:
          application/x-www-form-urlencoded:
            schema:
              type: object
              properties: {}
            examples: {}
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties: {}
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅流量子账号 （包月）
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-309042199-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
