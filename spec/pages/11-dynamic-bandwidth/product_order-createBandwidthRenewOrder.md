# 续费动态不限流量

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/product_order/createBandwidthRenewOrder:
    post:
      summary: 续费动态不限流量
      deprecated: false
      description: |-
        按子账号**当前带宽**与所属网关的**当前价**计价，到期时间顺延，续费不改变带宽。
        到期后 7 天内仍可续费，超期需重新购买。

        已到期的子账号续费会先按原带宽做库存预查，不足时返回
        「当前可分配带宽不足，请选择较低带宽或联系客服处理」且 `data.bandwidthError = 1`；
        未到期续费不做预查。

        固定**余额支付并当场发货**，不接收 `pay_method`；余额不够返回「用户余额不足，无法支付」，订单整单回滚。
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
                bill_timelen:
                  description: 时长档：1=30天，2=90天，3=180天
                  example: '1'
                  type: string
                user_conpon_id:
                  description: 优惠券 id
                  example: ''
                  type: string
              required:
                - sub_account_id
                - bill_timelen
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
                            type: integer
                          is_invoice:
                            type: string
                          product_type_id:
                            type: integer
                          bill_timelen:
                            type: string
                            title: 时长档：1=30天，2=90天，3=180天
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
                        title: 续费订单
                      sub_account_id:
                        type: integer
                        title: 子账号 id（对应动态住宅不限流量子账号列表的 `sub_account_id`）
                      expiresIn:
                        type: integer
                        title: 续费后的过期时间戳
                      expireDate:
                        type: string
                        title: 续费后的过期时间
                    required:
                      - orderProductBuy
                      - sub_account_id
                      - expiresIn
                      - expireDate
                    x-apifox-orders:
                      - orderProductBuy
                      - sub_account_id
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
                msg: 续费成功
                time: '1790069405'
                data:
                  orderProductBuy:
                    id: 1
                    user_id: 1
                    order_number: '2026092217300'
                    description: 【全球动态住宅 - 动态不限流量】续费 10Mbps/30天
                    pay_gateway: 3
                    ums_wallet: null
                    order_status: 2
                    order_category: 1
                    origin_money: '500.00'
                    real_money: '20.00'
                    real_money_ip: '20.00'
                    real_money_bandwidth: '0.00'
                    back_money_ip: '0.00'
                    back_money_bandwidth: '0.00'
                    conpon_status: '0'
                    conpon_money: '0.00'
                    discount: null
                    use_coupon: '0'
                    user_coupon_id: 0
                    is_invoice: '0'
                    product_type_id: 11
                    bill_timelen: '1'
                    is_back: '0'
                    balance: '1753.11'
                    remark: null
                    createtime: 1790069406
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
                    use_custom_price_limit: '20.00'
                    renew_timelen_data: '{"sub_account_id": 1}'
                    is_renew_order: 1
                    is_bandwidth_upgrade_order: 0
                    is_book_ip_done: 0
                    is_valid: '0'
                    is_admin: '0'
                    is_virtual: '1'
                    ip_str: null
                    exclude_ip_str: null
                    bandwidth_num: 10
                    admin_id: 0
                    updated: '2026-09-22 17:30:06'
                    is_use_random_account_password: 0
                    use_ip_port: 0
                    order_source: 2
                  sub_account_id: 1951
                  expiresIn: 1795252797
                  expireDate: '2026-11-21 17:19:57'
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅不限流量
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-518857566-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
