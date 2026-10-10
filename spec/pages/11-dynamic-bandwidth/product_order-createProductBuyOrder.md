# 购买动态住宅不限流量

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/product_order/createProductBuyOrder:
    post:
      summary: 购买动态住宅不限流量
      deprecated: false
      description: 购买动态住宅不限流量
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
                product_type_id:
                  description: 产品类型id，此处固定为：11
                  example: 11
                  type: integer
                bill_timelen:
                  description: 天数:1=30天，2=90天，3=180天
                  example: 1
                  type: integer
                country:
                  description: 国家编码，目前仅US / DE / SG 3个国家
                  example: us
                  type: string
                bandwidth_num:
                  type: integer
                  description: 带宽 Mbps，10 的倍数，最低 10，上限 1000
                  example: 10
                remark:
                  description: 创建的子账号备注
                  example: test
                  type: string
              required:
                - product_type_id
                - bill_timelen
                - country
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
                            password:
                              type: string
                              title: 密码
                            username:
                              type: string
                              title: 用户名
                            id:
                              type: integer
                              title: 子账号id(用于续费或修改)
                            is_bind:
                              type: string
                            bindUser:
                              type: string
                            disabled:
                              type: integer
                              title: 是否被禁用
                            bindPassword:
                              type: string
                            createTime:
                              type: string
                              title: 创建时间
                            port:
                              type: integer
                              title: 端口
                            agree:
                              type: string
                              title: 协议
                            target:
                              type: string
                              title: 代理主机 / 地址
                            changeInterval:
                              type: integer
                            expiresIn:
                              type: integer
                              title: 到期时间戳
                            ip:
                              type: string
                              title: 出口ip
                            bill:
                              type: string
                              title: 已使用流量
                            is_diff:
                              type: integer
                            country:
                              type: string
                              title: 国家code
                            countryName:
                              type: string
                              title: 国家名称
                            state:
                              type: string
                              title: 洲
                            remark:
                              type: string
                              title: 备注
                            city:
                              type: string
                              title: 城市名称
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
                            - changeInterval
                            - expiresIn
                            - ip
                            - bill
                            - is_diff
                            - country
                            - countryName
                            - state
                            - remark
                            - city
                      order_number:
                        type: string
                        title: 订单编号
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
              example:
                code: 1
                msg: 购买成功
                time: '1746667816'
                data:
                  sub_accounts:
                    - password: test
                      username: test
                      id: 9
                      is_bind: 否
                      bindUser: test
                      disabled: 0
                      bindPassword: test
                      createTime: '2025-05-08 09:30:17'
                      port: 5001
                      agree: SOCKS5
                      target: proxy.quanqiudaili.com
                      changeInterval: 0
                      expiresIn: 1747272617
                      ip: 127.0.0.1
                      bill: '0.00'
                      is_diff: 0
                      country: US
                      countryName: 美国
                      state: California
                      remark: ''
                      city: Los Angeles
                  order_number: 202505080xxxxxxxx
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅不限流量
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-518829781-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
