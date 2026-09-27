# 购买静态住宅（普通非原生）时长测试IP

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/product_order/createTestOrder:
    post:
      summary: 购买静态住宅（普通非原生）时长测试IP
      deprecated: false
      description: 购买静态住宅（普通非原生）时长测试IP，购买测试IP通常用于自有平台短期时长购买，购买会按照时长扣费
      tags:
        - 用户IP子账号管理/静态住宅（普通非原生）时长子账号
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
                  description: 产品类型id，此处固定为：2
                  example: 2
                  type: integer
                num:
                  description: 需要短期购买的子账号数量。范围：1-20之间
                  example: 1
                  type: integer
                timelen:
                  description: 时长计费：固定为12小时
                  example: 72
                  type: integer
                agree:
                  description: 协议：SOCKS5，HTTP，HTTPS
                  example: SOCKS5
                  type: string
                country:
                  description: 静态住宅国家编码code
                  example: US
                  type: string
                city:
                  description: 静态住宅城市名称,不传默认随机。
                  example: Los Angeles
                  type: string
                bandwidth_num:
                  type: integer
                  description: 不传默认是5M，可传值10和15,10M按每条人民币10元,15M按每条人民币15元计费
                  example: 5
              required:
                - product_type_id
                - num
                - timelen
                - agree
                - country
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
                      orderProductBuy:
                        type: object
                        properties:
                          user_id:
                            type: integer
                          order_number:
                            type: string
                          description:
                            type: string
                          pay_gateway:
                            type: integer
                          order_status:
                            type: integer
                          order_category:
                            type: integer
                          origin_money:
                            type: string
                          real_money:
                            type: string
                          balance:
                            type: string
                          createtime:
                            type: integer
                          product_type_id:
                            type: integer
                          scope_native:
                            type: string
                          scene:
                            type: string
                          buy_num:
                            type: string
                          country:
                            type: string
                          area:
                            type: string
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
                          - balance
                          - createtime
                          - product_type_id
                          - scope_native
                          - scene
                          - buy_num
                          - country
                          - area
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
                          - balance
                          - createtime
                          - product_type_id
                          - scope_native
                          - scene
                          - buy_num
                          - country
                          - area
                          - id
                        title: 订单信息
                      rows:
                        type: array
                        items:
                          type: object
                          properties:
                            password:
                              type: string
                            username:
                              type: string
                            id:
                              type: integer
                            is_bind:
                              type: string
                            bindUser:
                              type: string
                            disabled:
                              type: integer
                            bindPassword:
                              type: string
                            createTime:
                              type: string
                            port:
                              type: integer
                            agree:
                              type: string
                            target:
                              type: string
                            poolStatus:
                              type: string
                            changeInterval:
                              type: integer
                            expiresIn:
                              type: integer
                            expiresDate:
                              type: string
                            ip:
                              type: string
                            bill:
                              type: string
                            is_diff:
                              type: integer
                            country:
                              type: string
                            countryName:
                              type: string
                            state:
                              type: string
                            remark:
                              type: string
                            city:
                              type: string
                          required:
                            - password
                            - username
                            - id
                            - is_bind
                            - bindUser
                            - disabled
                            - bindPassword
                            - createTime
                            - port
                            - agree
                            - target
                            - poolStatus
                            - changeInterval
                            - expiresIn
                            - expiresDate
                            - ip
                            - bill
                            - is_diff
                            - country
                            - countryName
                            - state
                            - remark
                            - city
                          x-apifox-orders:
                            - password
                            - username
                            - id
                            - is_bind
                            - bindUser
                            - disabled
                            - bindPassword
                            - createTime
                            - port
                            - agree
                            - target
                            - poolStatus
                            - changeInterval
                            - expiresIn
                            - expiresDate
                            - ip
                            - bill
                            - is_diff
                            - country
                            - countryName
                            - state
                            - remark
                            - city
                        title: 子账号详情
                    required:
                      - orderProductBuy
                      - rows
                    x-apifox-orders:
                      - orderProductBuy
                      - rows
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
      x-apifox-folder: 用户IP子账号管理/静态住宅（普通非原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-338644388-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
