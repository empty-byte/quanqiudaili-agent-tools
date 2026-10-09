# 生成带宽升级订单

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/product_order/createBandwidthUpgradeOrder:
    post:
      summary: 生成带宽升级订单
      deprecated: false
      description: ''
      tags:
        - 增值带宽
      parameters:
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
              properties:
                product_type_id:
                  type: integer
                  description: 产品类型。2=静态住宅（非原生）;3=静态住宅（原生）;4=静态住宅（运营商原生）
                  example: 3
                pay_method:
                  description: 对外接口固定： balance
                  example: balance
                  type: string
                subAccountIds[]:
                  description: 子账号id。数组传递
                  example:
                    - '33'
                    - '32'
                  type: array
                bandwidth_num:
                  type: integer
                  description: 要升级的带宽值，升级的带宽值要大于现在的带宽值
                  example: 30
              required:
                - product_type_id
                - pay_method
                - subAccountIds[]
                - bandwidth_num
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
                  msg:
                    type: string
                  time:
                    type: string
                  data:
                    type: object
                    properties:
                      orderProductBuy:
                        type: object
                        properties:
                          user_id:
                            type: integer
                          order_number:
                            type: string
                            description: 订单编号
                          description:
                            type: string
                          pay_gateway:
                            type: integer
                          order_status:
                            type: integer
                          order_category:
                            type: integer
                          origin_money:
                            type: number
                            description: 订单原生金额
                          real_money:
                            type: number
                            description: 订单实际支付金额
                          real_money_bandwidth:
                            type: number
                            description: 订单带宽金额
                          balance:
                            type: string
                          country:
                            type: string
                          createtime:
                            type: integer
                          product_type_id:
                            type: integer
                          scope_native:
                            type: string
                          buy_num:
                            type: integer
                          is_use_custom_unit_price:
                            type: integer
                          use_custom_price_limit:
                            type: integer
                          bandwidth_num:
                            type: string
                          is_bandwidth_upgrade_order:
                            type: integer
                          order_source:
                            type: integer
                          id:
                            type: string
                        required:
                          - user_id
                          - order_number
                          - description
                          - pay_gateway
                          - order_status
                          - order_category
                          - origin_money
                          - real_money
                          - real_money_bandwidth
                          - balance
                          - country
                          - createtime
                          - product_type_id
                          - scope_native
                          - buy_num
                          - is_use_custom_unit_price
                          - use_custom_price_limit
                          - bandwidth_num
                          - is_bandwidth_upgrade_order
                          - order_source
                          - id
                        x-apifox-orders:
                          - user_id
                          - order_number
                          - description
                          - pay_gateway
                          - order_status
                          - order_category
                          - origin_money
                          - real_money
                          - real_money_bandwidth
                          - balance
                          - country
                          - createtime
                          - product_type_id
                          - scope_native
                          - buy_num
                          - is_use_custom_unit_price
                          - use_custom_price_limit
                          - bandwidth_num
                          - is_bandwidth_upgrade_order
                          - order_source
                          - id
                        description: 订单信息
                    required:
                      - orderProductBuy
                    x-apifox-orders:
                      - orderProductBuy
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
                msg: 带宽升级订单创建成功！
                time: '1790491154'
                data:
                  orderProductBuy:
                    user_id: 77
                    order_number: 2026092xxxxxxx
                    description: 带宽升级【独享静态住宅（本土原生）】。升级地区数量：2，升级带宽：30Mbps
                    pay_gateway: 3
                    order_status: 1
                    order_category: 1
                    origin_money: 3.73
                    real_money: 3.73
                    real_money_bandwidth: 3.73
                    balance: '422.64'
                    country: US
                    createtime: 1790491155
                    product_type_id: 3
                    scope_native: local
                    buy_num: 2
                    is_use_custom_unit_price: 0
                    use_custom_price_limit: 0
                    bandwidth_num: '30'
                    is_bandwidth_upgrade_order: 1
                    order_source: 2
                    id: '174144'
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 增值带宽
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-356575332-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
