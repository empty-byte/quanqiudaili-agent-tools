# 续费静态住宅（运营商原生）时长IP

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/product_order/createRenewProductBuyOrder:
    post:
      summary: 续费静态住宅（运营商原生）时长IP
      deprecated: false
      description: |
        续费静态住宅（运营商原生）时长IP
      tags:
        - 用户IP子账号管理/静态住宅（运营商原生）时长子账号
      parameters:
        - name: token
          in: header
          description: ''
          required: false
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
                  description: 产品类型id，此处固定为：4
                  example: 4
                  type: integer
                timelen:
                  type: integer
                  description: 时长计费类型：0=7天，1=30天，2=90天，3=180天，4=360天
                  example: 0
                sub_account_ids:
                  description: 续费的子账号id，多个以英文逗号连接，单次最多 300 个
                  example: 1,2
                  type: string
                renew_with_bandwidth:
                  type: integer
                  description: 续费时是否包含带宽:0=不包含,1=包含。会同时写回子账号的自动续费带宽设置
                  example: 0
                is_renew:
                  type: integer
                  description: 是否开启自动续费。0=不开启自动续费，1=开启自动续费。不传按 0、会写回自动续费设置
                  example: 0
              required:
                - product_type_id
                - timelen
                - sub_account_ids
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
                    description: 响应编码:1=正常,0=错误
                  msg:
                    type: string
                    description: 响应说明
                  time:
                    type: string
                  data:
                    type: object
                    properties:
                      sub_accounts:
                        type: array
                        items:
                          type: object
                          properties:
                            id:
                              type: integer
                              title: 子账号id
                            expiresIn:
                              type: integer
                              title: 续费后的过期时间戳
                            expiresDate:
                              type: string
                              title: 续费后的过期时间
                          x-apifox-orders:
                            - id
                            - expiresIn
                            - expiresDate
                      order_number:
                        type: string
                    required:
                      - sub_accounts
                      - order_number
                    x-apifox-orders:
                      - sub_accounts
                      - order_number
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
      x-apifox-folder: 用户IP子账号管理/静态住宅（运营商原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-494471305-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
