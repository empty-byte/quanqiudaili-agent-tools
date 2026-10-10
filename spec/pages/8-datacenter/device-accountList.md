# 获取数据中心子账号列表

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
      summary: 获取数据中心子账号列表
      deprecated: false
      description: 获取数据中心子账号列表
      tags:
        - 用户IP子账号管理/数据中心时长子账号
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型id，此处固定类别为：8
          required: true
          example: 8
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
        - name: remark
          in: query
          description: 子账号备注
          required: false
          example: ''
          schema:
            type: string
        - name: country
          in: query
          description: >-
            数据中心国家编码code，例如：US。可从<a href='/api-222488747'
            target='_blank'>数据中心国家列表获取</a>
          required: false
          example: ''
          schema:
            type: string
        - name: ids
          in: query
          description: 子账号id集合，多个以英文逗号连接
          required: false
          example: '1'
          schema:
            type: string
        - name: subAccountStart
          in: query
          description: 子账号区间搜索[初始]。跨度不超过 5000
          required: false
          example: 100
          schema:
            type: integer
        - name: subAccountEnd
          in: query
          description: 子账号区间搜索[结束]。跨度不超过 5000
          required: false
          example: 200
          schema:
            type: integer
        - name: exportIp
          in: query
          description: 出口IP,支持模糊查询
          required: false
          example: '150'
          schema:
            type: string
        - name: token
          in: header
          description: 用户api key。<a href="/9518262m0" target="_blank">api key获取方式</a>
          required: false
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
                  msg:
                    type: string
                  time:
                    type: string
                  data:
                    type: object
                    properties:
                      total:
                        type: integer
                      rows:
                        type: array
                        items:
                          type: object
                          properties:
                            id:
                              type: string
                            is_diff:
                              type: integer
                            agree:
                              type: string
                            country:
                              type: string
                            target:
                              type: string
                            port:
                              type: integer
                            username:
                              type: string
                            password:
                              type: string
                            is_bind:
                              type: string
                            remark:
                              type: string
                            poolStatus:
                              type: string
                            bindUser:
                              type: string
                            bindPassword:
                              type: string
                            ip:
                              type: string
                            countdown:
                              type: string
                            expiresIn:
                              type: integer
                            createtime:
                              type: string
                            state:
                              type: string
                            portEnable:
                              type: integer
                            city:
                              type: string
                            bill:
                              type: integer
                            countryName:
                              type: string
                            status:
                              type: integer
                            expireDate:
                              type: string
                            expiresDate:
                              type: string
                            order_back_date_valid:
                              type: boolean
                            bandwidth_num:
                              type: integer
                            order_product_buy_id:
                              type: integer
                            order_back_status:
                              type: integer
                            is_renew:
                              type: integer
                            renew_with_bandwidth:
                              type: integer
                            order_back_reject_reason:
                              type: string
                            renewtime:
                              type: string
                          x-apifox-orders:
                            - id
                            - is_diff
                            - agree
                            - country
                            - target
                            - port
                            - username
                            - password
                            - is_bind
                            - remark
                            - poolStatus
                            - bindUser
                            - bindPassword
                            - ip
                            - countdown
                            - expiresIn
                            - createtime
                            - state
                            - portEnable
                            - city
                            - bill
                            - countryName
                            - status
                            - expireDate
                            - expiresDate
                            - order_back_date_valid
                            - bandwidth_num
                            - order_product_buy_id
                            - order_back_status
                            - is_renew
                            - renew_with_bandwidth
                            - order_back_reject_reason
                            - renewtime
                      countryList:
                        type: array
                        items:
                          type: string
                      base:
                        type: object
                        properties:
                          total:
                            type: integer
                          normal:
                            type: integer
                          expiring_soon:
                            type: integer
                        required:
                          - total
                          - normal
                          - expiring_soon
                        x-apifox-orders:
                          - total
                          - normal
                          - expiring_soon
                    required:
                      - total
                      - rows
                      - countryList
                      - base
                    x-apifox-orders:
                      - total
                      - rows
                      - countryList
                      - base
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
                msg: 获取成功
                time: '1790492714'
                data:
                  total: 1
                  rows:
                    - id: '1'
                      is_diff: 0
                      agree: SOCKS5
                      country: US
                      target: proxy.quanqiudaili.com
                      port: 5001
                      username: xxxxxx-1
                      password: xxxxx
                      is_bind: '0'
                      remark: ''
                      poolStatus: online
                      bindUser: xxxxxx-1
                      bindPassword: xxxxx
                      ip: 207.1xx80.xx.xx
                      countdown: 30.0天
                      expiresIn: 1793084710
                      createtime: '2026-09-27 15:05:11'
                      state: New York
                      portEnable: 0
                      city: New York City
                      bill: 0
                      countryName: 美国
                      status: 1
                      expireDate: '2026-10-27 15:05:10'
                      expiresDate: '2026-10-27 15:05:10'
                      order_back_date_valid: true
                      bandwidth_num: 5
                      order_product_buy_id: 0
                      order_back_status: 0
                      is_renew: 0
                      renew_with_bandwidth: 0
                      order_back_reject_reason: ''
                      renewtime: ''
                  countryList: []
                  base:
                    total: 0
                    normal: 0
                    expiring_soon: 0
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/数据中心时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222488896-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
