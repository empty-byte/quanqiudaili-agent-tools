# 设置子账号流量上限

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/tool/accountLimitFlowEdit:
    post:
      summary: 设置子账号流量上限
      deprecated: false
      description: 设置动态住宅（包月）子账号流量上限
      tags:
        - 用户IP子账号管理/动态住宅流量子账号 （包月）
      parameters:
        - name: token
          in: header
          description: 用户api key。<a href="/9518262m0" target="_blank">api key获取方式</a>
          required: true
          example: '{{access_token}}'
          schema:
            type: string
      requestBody:
        content:
          application/x-www-form-urlencoded:
            schema:
              type: object
              properties:
                product_type_id:
                  type: integer
                  description: 产品类型id，此处固定类别为：6
                  example: 6
                id:
                  type: integer
                  description: 子账号id
                  example: 44
                limit_flow:
                  type: integer
                  description: >-
                    流量上限，GB，0 到 1000000；0 =
                    取消限制并删除限流记录。新上限低于已用量时，该子账号会立即停用，并断开正在使用的连接
                  example: 2
                type:
                  type: integer
                  description: 限流类型：0 = 永久，按子账号累计用量，默认；1 = 周期
                  example: 1
                timelen:
                  description: 周期：0=天、1=周、2=月、3=季度、4=年；type=1 时有效，type=0 时忽略
                  example: '2'
                  type: string
              required:
                - product_type_id
                - id
                - limit_flow
            examples: {}
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                    title: 1为成功,0为失败
                  msg:
                    type: string
                  time:
                    type: string
                  data:
                    type: 'null'
                required:
                  - code
                  - msg
                  - time
                  - data
                x-apifox-orders:
                  - code
                  - msg
                  - time
                  - data
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅流量子账号 （包月）
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-309042096-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
