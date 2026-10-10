# 动态不限流量申请退单

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/order_back/createOrderBack:
    post:
      summary: 动态不限流量申请退单
      deprecated: false
      description: 不同订单的子账号列表退单请分开请求。退单审核通过后，会删除或终止子账号，无法恢复。请您注意
      tags:
        - 用户IP子账号管理/动态住宅不限流量
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
                order_product_buy_id:
                  type: integer
                  description: >-
                    订单id，对应<a href='/api-518792421e0'
                    target='_blank'>动态住宅不限流量子账号列表</a>里的order_product_buy_id
                  example: 1
                remark:
                  description: 退单备注
                  example: 退单备注
                  type: string
              required:
                - order_product_buy_id
                - remark
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
                    description: 错误说明
                  time:
                    type: string
                    description: 响应时间戳
                  data:
                    type: string
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
              example:
                code: 1
                msg: 您的IP退单申请已提交，请您耐心等待！
                time: '1764815463'
                data: null
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅不限流量
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-518878355-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
