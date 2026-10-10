# 获取动态住宅不限流量子账号列表 

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/device/accountList:
    get:
      summary: '获取动态住宅不限流量子账号列表 '
      deprecated: false
      description: '获取动态住宅不限流量子账号列表 '
      tags:
        - 用户IP子账号管理/动态住宅不限流量
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型id，此处固定为：11
          required: true
          example: 11
          schema:
            type: integer
        - name: page
          in: query
          description: 当前页数
          required: true
          example: 1
          schema:
            type: integer
        - name: pagesize
          in: query
          description: 每页显示数量。每页最大100条数据
          required: true
          example: 10
          schema:
            type: integer
        - name: ids
          in: query
          description: 子账号id集合，多个以英文逗号连接
          required: false
          example: '642'
          schema:
            type: string
        - name: search_type
          in: query
          description: 搜索类别：0=子账号名，1=出口 IP，2=备注
          required: false
          example: '0'
          schema:
            type: string
        - name: searchArr[0]
          in: query
          description: 按子账号名精确搜索，可重复传多个（searchArr[]=a&searchArr[]=b），需配合 search_type
          required: false
          example: 127.0.0.1
          schema:
            type: string
        - name: searchArr[1]
          in: query
          description: ''
          required: false
          example: 127.0.0.2
          schema:
            type: string
        - name: token
          in: header
          description: 用户api key。<a href="/9518262m0" target="_blank">api key获取方式</a>
          required: true
          example: '{{access_token}}'
          schema:
            type: string
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
                    title: 响应时间戳
                  data:
                    type: object
                    properties:
                      total:
                        type: integer
                        title: 总数
                      rows:
                        type: array
                        items:
                          type: object
                          properties:
                            id:
                              type: string
                            username:
                              type: string
                              title: 子账号用户名
                            password:
                              type: string
                              title: 子账号密码
                            port:
                              type: integer
                              title: 端口
                            target:
                              type: string
                              title: 代理主机/地址
                            server_country:
                              type: string
                            agree:
                              type: string
                              title: 代理协议，大写，如 SOCKS5 / HTTP / HTTPS
                            country:
                              type: string
                              title: 出口国家码，如 US、DE；全球随机为 ALL
                            countryName:
                              type: string
                              title: 出口国家显示名称
                            state:
                              type: string
                            city:
                              type: string
                            changeInterval:
                              type: integer
                              title: IP 切换间隔，单位秒；更新接口接收的是分钟
                            url:
                              type: string
                            ip:
                              type: string
                            remark:
                              type: string
                            expiresIn:
                              type: integer
                              title: 绝对到期时间戳（秒），不是剩余秒数
                            expireDate:
                              type: string
                              title: 到期时间
                            createtime:
                              type: string
                              title: 子账号创建时间
                            bandwidth_num:
                              type: integer
                            status:
                              type: integer
                              title: >-
                                列表展示状态：1 正常（剩余大于 7 天）/ 2 即将过期（大于 0 且不超过 7 天）/ 3
                                已过期（含恰好到期）
                            sub_account_id:
                              type: integer
                              title: 本地子账号 ID，用于续费、升级的 sub_account_id 入参
                            order_product_buy_id:
                              type: integer
                            unit_price:
                              type: integer
                            is_custom_price:
                              type: integer
                            area:
                              type: string
                              title: 接入网关大洲码：us 美洲 / sg 亚洲 / eu 欧洲
                            area_name:
                              type: string
                              title: 网关区域中文名：美洲 / 亚洲 / 欧洲；
                            can_renew:
                              type: integer
                              title: 是否可续费：1 可 / 0 不可。到期后 7 天截止时刻前（含）可续费
                            order_back:
                              type: object
                              properties:
                                id:
                                  type: integer
                                status:
                                  type: integer
                                back_money:
                                  type: number
                                reject_reason:
                                  type: string
                              required:
                                - id
                                - status
                                - back_money
                                - reject_reason
                              x-apifox-orders:
                                - id
                                - status
                                - back_money
                                - reject_reason
                              nullable: true
                            can_apply_back:
                              type: integer
                              title: 否可自助申请退单：1 可 / 0 不可
                          required:
                            - id
                            - username
                            - password
                            - port
                            - target
                            - server_country
                            - agree
                            - country
                            - countryName
                            - state
                            - city
                            - changeInterval
                            - url
                            - ip
                            - remark
                            - expiresIn
                            - expireDate
                            - createtime
                            - bandwidth_num
                            - status
                            - sub_account_id
                            - order_product_buy_id
                            - unit_price
                            - is_custom_price
                            - area
                            - area_name
                            - can_renew
                            - order_back
                            - can_apply_back
                          x-apifox-orders:
                            - id
                            - username
                            - password
                            - port
                            - target
                            - server_country
                            - agree
                            - country
                            - countryName
                            - state
                            - city
                            - changeInterval
                            - url
                            - ip
                            - remark
                            - expiresIn
                            - expireDate
                            - createtime
                            - bandwidth_num
                            - status
                            - sub_account_id
                            - order_product_buy_id
                            - unit_price
                            - is_custom_price
                            - area
                            - area_name
                            - can_renew
                            - order_back
                            - can_apply_back
                        title: 响应内容
                      page:
                        type: integer
                        title: 当前页数
                      pagesize:
                        type: integer
                        title: 每页显示数量
                      countryList:
                        type: array
                        items:
                          type: object
                          properties:
                            country:
                              type: string
                            countryName:
                              type: string
                          required:
                            - country
                            - countryName
                          x-apifox-orders:
                            - country
                            - countryName
                        title: 城市列表(用于城市搜索)
                      statistics:
                        type: object
                        properties:
                          normal:
                            type: integer
                            title: 正常子账号数量:剩余时间大于 7 天
                          expiring:
                            type: integer
                            title: 即将过期子账号数量：剩余大于 0 且不超过 7 天
                          expired:
                            type: integer
                            title: 已过期子账号数量：已到期（含恰好到期）
                        required:
                          - normal
                          - expiring
                          - expired
                        x-apifox-orders:
                          - normal
                          - expiring
                          - expired
                        title: 统计
                    required:
                      - total
                      - rows
                      - page
                      - pagesize
                      - countryList
                      - statistics
                    x-apifox-orders:
                      - total
                      - rows
                      - page
                      - pagesize
                      - countryList
                      - statistics
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
                          createTime: '2025-05-06 11:50:20'
                          state: New York
                          city: New York City
                          portEnable: 1
                          bill: 0
                          countryName: 美国
                          status: 1
                          expireDate: '2025-05-13 11:50:19'
                          expiresDate: '2025-05-13 11:50:19'
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
                  summary: 成功示例
                  value:
                    code: 1
                    msg: 获取成功
                    time: '1746503431'
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
                      countryList:
                        - country: US
                          countryName: 美国
                      base:
                        total: 1
                        normal: 1
                        expiring_soon: 0
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅不限流量
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-518792421-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
