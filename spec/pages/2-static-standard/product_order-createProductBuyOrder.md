# 购买静态住宅（普通非原生）时长IP

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
      summary: 购买静态住宅（普通非原生）时长IP
      deprecated: false
      description: 购买静态住宅（普通非原生）时长IP
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
                  example: 3
                  type: integer
                num:
                  description: 需要购买的子账号数量。范围：1-300之间
                  example: 1
                  type: integer
                timelen:
                  description: 时长计费类型：0=7天，1=30天，2=90天，3=180天，4=360天，5=3天
                  example: 0
                  type: integer
                agree:
                  description: 协议：SOCKS5，HTTP，HTTPS
                  example: SOCKS5
                  type: string
                country:
                  description: >-
                    静态住宅国家编码code，例如：US。可从<a href='/api-222487309'
                    target='_blank'>静态住宅（普通非原生）国家列表获取</a>
                  example: US
                  type: string
                city:
                  description: >-
                    静态住宅城市名称。在<a href='/api-222487647'
                    target='_blank'>静态住宅（普通非原生）城市列表</a>可获取城市名称。不传默认随机。
                  example: Los Angeles
                  type: string
                appoint_ip[0][ip_str]:
                  type: string
                  description: 指定ip段
                  example: '149.40'
                appoint_ip[0][count]:
                  description: 指定数量
                  example: '1'
                  type: string
                exclude_ip_str:
                  description: 排除段,多个以英文逗号分隔
                  example: '149.52'
                  type: string
                bandwidth_num:
                  type: integer
                  description: |
                    带宽值
                  example: 5
                remark:
                  description: 创建的子账号备注
                  example: test
                  type: string
                use_ip_port:
                  type: integer
                  description: 是否开启ip端口连接:0=不开启,1=开启(默认为0)
                  example: 1
                random_account_password:
                  type: integer
                  description: 是否生成随机账号密码:0=否,1=是(默认为0)
                  example: 0
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
                              title: 账号
                            id:
                              type: integer
                              title: 编码
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
                              title: 端口
                            agree:
                              type: string
                              title: 协议
                            target:
                              type: string
                              title: 主机
                            poolStatus:
                              type: string
                              title: 子账号状态
                            changeInterval:
                              type: integer
                            expiresIn:
                              type: integer
                              title: 过期时间戳
                            expiresDate:
                              type: string
                              title: 过期时间
                            ip:
                              type: string
                              title: ip
                            bill:
                              type: string
                              title: 已使用流量
                            is_diff:
                              type: integer
                            country:
                              type: string
                              title: 国家编码
                            countryName:
                              type: string
                              title: 国家code
                            state:
                              type: string
                            remark:
                              type: string
                              title: 备注
                            city:
                              type: string
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
                      order_number:
                        type: string
                        title: 订单号
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
              examples:
                '1':
                  summary: 成功示例
                  value:
                    code: 1
                    msg: 获取成功
                    time: '1697164784'
                    data:
                      total: 1
                      rows:
                        - id: '1'
                          is_diff: 0
                          agree: SOCKS5
                          country: US
                          target: proxy.quanqiudaili.com
                          port: 5001
                          username: test
                          password: test
                          is_bind: '0'
                          remark: ''
                          poolStatus: online
                          bindUser: test
                          bindPassword: test
                          ip: 172.11.11.11
                          countdown: 7.0天
                          expiresIn: 1747108219
                          createtime: '2025-05-06 11:50:20'
                          state: New York
                          city: New York City
                          bill: 0
                          countryName: 美国
                          status: 1
                          expireDate: '2025-05-13 11:50:19'
                          order_back_date_valid: true
                          order_product_buy_id: 16874
                          order_back_status: 0
                          is_renew: '0'
                          order_back_reject_reason: null
                          renewtime: '1970-01-01'
                      baseFlow: 180.31
                      countryList:
                        - id: 1
                          countryName: 全球随机
                          country: ALL
                        - id: 1671
                          conutry: AX
                          countryName: 奥兰
                          type_text: ''
                          status_text: ''
                        - id: 1672
                          conutry: AL
                          countryName: 阿尔巴尼亚
                          type_text: ''
                          status_text: ''
                        - id: 4038
                          conutry: XK
                          countryName: 科索沃
                          type_text: ''
                          status_text: ''
                '2':
                  summary: 异常示例
                  value:
                    code: 0
                    msg: 该产品已售罄，请选择其它产品
                    time: '1753154934'
                    data: null
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/静态住宅（普通非原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222033956-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
