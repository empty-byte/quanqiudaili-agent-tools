# 带宽升级动态不限流量

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/product_order/createBandwidthUpgradeOrderForDrfbw:
    post:
      summary: 带宽升级动态不限流量
      deprecated: false
      description: |-
        只升不降，到期时间不变。差价按剩余天数折算：

         `差价 =（新档单价 × 新带宽 − 原成交单价 × 原带宽）× 剩余天数 / 30`

         剩余天数 = `max(1, ceil((到期时间 − 当前时间) / 86400))`，向上取整，不足一天按一天。

         **升级不支持优惠券**。自定义价额度不够覆盖差价时整单按官网价计，不占额度。
        按升级后的带宽做库存预查，不足时 `data.bandwidthError = 1`。
      tags:
        - 用户IP子账号管理/动态住宅不限流量
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
                sub_account_id:
                  description: >-
                    子账号 id（对应的<a href='/api-518792421e0'
                    target='_blank'>动态住宅不限流量子账号列表</a>`sub_account_id`）
                  example: '1951'
                  type: string
                bandwidth_num:
                  description: 升级后带宽 Mbps，必须**大于**当前带宽，且为 10 的倍数、不超过 1000
                  example: '10'
                  type: string
              required:
                - sub_account_id
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
                    title: 响应编码:1=正常,0=错误
                  msg:
                    type: string
                    title: 错误说明
                  time:
                    type: string
                  data:
                    type: object
                    properties:
                      orderProductBuy:
                        type: object
                        properties:
                          id:
                            type: integer
                          user_id:
                            type: integer
                          order_number:
                            type: string
                            title: 订单号
                          description:
                            type: string
                          pay_gateway:
                            type: integer
                          ums_wallet:
                            type: 'null'
                          order_status:
                            type: integer
                          order_category:
                            type: integer
                          origin_money:
                            type: string
                          real_money:
                            type: string
                            title: 实付金额
                          real_money_ip:
                            type: string
                          real_money_bandwidth:
                            type: string
                          back_money_ip:
                            type: string
                          back_money_bandwidth:
                            type: string
                          conpon_status:
                            type: string
                          conpon_money:
                            type: string
                          discount:
                            type: 'null'
                          use_coupon:
                            type: string
                          user_coupon_id:
                            type: 'null'
                          is_invoice:
                            type: string
                          product_type_id:
                            type: integer
                          bill_timelen:
                            type: string
                          is_back:
                            type: string
                          balance:
                            type: string
                          remark:
                            type: 'null'
                          createtime:
                            type: integer
                          updatetime:
                            type: 'null'
                          scope_timelen:
                            type: integer
                          scope_native:
                            type: 'null'
                          scope_area:
                            type: 'null'
                          country:
                            type: string
                          state:
                            type: 'null'
                          area:
                            type: 'null'
                          is_set_meal:
                            type: string
                          set_meal_id:
                            type: 'null'
                          scene:
                            type: 'null'
                          buy_num:
                            type: integer
                          is_use_custom_unit_price:
                            type: integer
                          use_custom_price_limit:
                            type: string
                          renew_timelen_data:
                            type: string
                          is_renew_order:
                            type: integer
                          is_bandwidth_upgrade_order:
                            type: integer
                          is_book_ip_done:
                            type: integer
                          is_valid:
                            type: string
                          is_admin:
                            type: string
                          is_virtual:
                            type: string
                          ip_str:
                            type: 'null'
                          exclude_ip_str:
                            type: 'null'
                          bandwidth_num:
                            type: integer
                            title: 带宽值
                          admin_id:
                            type: integer
                          updated:
                            type: string
                          is_use_random_account_password:
                            type: integer
                          use_ip_port:
                            type: integer
                          order_source:
                            type: integer
                        required:
                          - id
                          - user_id
                          - order_number
                          - description
                          - pay_gateway
                          - ums_wallet
                          - order_status
                          - order_category
                          - origin_money
                          - real_money
                          - real_money_ip
                          - real_money_bandwidth
                          - back_money_ip
                          - back_money_bandwidth
                          - conpon_status
                          - conpon_money
                          - discount
                          - use_coupon
                          - user_coupon_id
                          - is_invoice
                          - product_type_id
                          - bill_timelen
                          - is_back
                          - balance
                          - remark
                          - createtime
                          - updatetime
                          - scope_timelen
                          - scope_native
                          - scope_area
                          - country
                          - state
                          - area
                          - is_set_meal
                          - set_meal_id
                          - scene
                          - buy_num
                          - is_use_custom_unit_price
                          - use_custom_price_limit
                          - renew_timelen_data
                          - is_renew_order
                          - is_bandwidth_upgrade_order
                          - is_book_ip_done
                          - is_valid
                          - is_admin
                          - is_virtual
                          - ip_str
                          - exclude_ip_str
                          - bandwidth_num
                          - admin_id
                          - updated
                          - is_use_random_account_password
                          - use_ip_port
                          - order_source
                        x-apifox-orders:
                          - id
                          - user_id
                          - order_number
                          - description
                          - pay_gateway
                          - ums_wallet
                          - order_status
                          - order_category
                          - origin_money
                          - real_money
                          - real_money_ip
                          - real_money_bandwidth
                          - back_money_ip
                          - back_money_bandwidth
                          - conpon_status
                          - conpon_money
                          - discount
                          - use_coupon
                          - user_coupon_id
                          - is_invoice
                          - product_type_id
                          - bill_timelen
                          - is_back
                          - balance
                          - remark
                          - createtime
                          - updatetime
                          - scope_timelen
                          - scope_native
                          - scope_area
                          - country
                          - state
                          - area
                          - is_set_meal
                          - set_meal_id
                          - scene
                          - buy_num
                          - is_use_custom_unit_price
                          - use_custom_price_limit
                          - renew_timelen_data
                          - is_renew_order
                          - is_bandwidth_upgrade_order
                          - is_book_ip_done
                          - is_valid
                          - is_admin
                          - is_virtual
                          - ip_str
                          - exclude_ip_str
                          - bandwidth_num
                          - admin_id
                          - updated
                          - is_use_random_account_password
                          - use_ip_port
                          - order_source
                        title: 带宽升级订单
                      money:
                        type: integer
                      remain_days:
                        type: integer
                        title: 升级天数
                      sub_account_id:
                        type: integer
                        title: 子账号 id（对应动态住宅不限流量子账号列表的 `sub_account_id`）
                      bandwidth_num:
                        type: integer
                        title: 升级后的带宽
                      expiresIn:
                        type: integer
                        title: 续费后的过期时间戳
                      expireDate:
                        type: string
                        title: 续费后的过期时间
                    required:
                      - orderProductBuy
                      - money
                      - remain_days
                      - sub_account_id
                      - bandwidth_num
                      - expiresIn
                      - expireDate
                    x-apifox-orders:
                      - orderProductBuy
                      - money
                      - remain_days
                      - sub_account_id
                      - bandwidth_num
                      - expiresIn
                      - expireDate
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
                msg: 升级成功
                time: '1790070109'
                data:
                  orderProductBuy:
                    id: 1
                    user_id: 1
                    order_number: 202609xxxxx
                    description: 【全球动态住宅 - 动态不限流量】带宽升级 10Mbps → 20Mbps
                    pay_gateway: 3
                    ums_wallet: null
                    order_status: 2
                    order_category: 1
                    origin_money: '1.00'
                    real_money: '1.00'
                    real_money_ip: '1.00'
                    real_money_bandwidth: '0.00'
                    back_money_ip: '0.00'
                    back_money_bandwidth: '0.00'
                    conpon_status: '0'
                    conpon_money: '0.00'
                    discount: null
                    use_coupon: '0'
                    user_coupon_id: null
                    is_invoice: '0'
                    product_type_id: 11
                    bill_timelen: '1'
                    is_back: '0'
                    balance: '1.00'
                    remark: null
                    createtime: 1790070111
                    updatetime: null
                    scope_timelen: 1
                    scope_native: null
                    scope_area: null
                    country: us
                    state: null
                    area: null
                    is_set_meal: '0'
                    set_meal_id: null
                    scene: null
                    buy_num: 1
                    is_use_custom_unit_price: 1
                    use_custom_price_limit: '40.00'
                    renew_timelen_data: ''
                    is_renew_order: 0
                    is_bandwidth_upgrade_order: 1
                    is_book_ip_done: 0
                    is_valid: '0'
                    is_admin: '0'
                    is_virtual: '1'
                    ip_str: null
                    exclude_ip_str: null
                    bandwidth_num: 20
                    admin_id: 0
                    updated: '2026-09-22 17:41:51'
                    is_use_random_account_password: 0
                    use_ip_port: 0
                    order_source: 2
                  money: 1
                  remain_days: 1
                  sub_account_id: 1951
                  bandwidth_num: 20
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅不限流量
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-518864521-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
