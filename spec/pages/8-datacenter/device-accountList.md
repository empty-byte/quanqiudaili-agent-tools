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
          description: 子账号区间搜索[初始]
          required: false
          example: 100
          schema:
            type: integer
        - name: subAccountEnd
          in: query
          description: 子账号区间搜索[结束]
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
          description: ''
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
                    description: 响应编码:1=正常,0=错误
                  msg:
                    type: string
                    description: 错误说明
                  time:
                    type: string
                    description: 响应时间戳
                  data:
                    type: object
                    properties:
                      total:
                        type: integer
                        description: 总数
                      rows:
                        type: array
                        items:
                          type: object
                          properties:
                            password:
                              type: string
                              description: 子账号密码
                            username:
                              type: string
                              description: 子账号用户名
                            id:
                              type: integer
                              description: 子账号编码
                            is_bind:
                              type: string
                              description: 是否绑定
                            bindUser:
                              type: string
                              description: 绑定的账户
                            bindPassword:
                              type: string
                              description: 绑定的账户密码
                            createTime:
                              type: string
                              description: 添加时间
                            port:
                              type: integer
                              description: 端口
                            agree:
                              type: string
                              description: 协议
                            target:
                              type: string
                              description: 加速通道
                            ip:
                              type: string
                              description: 出口ip
                            bill:
                              type: integer
                              description: 消耗流量
                            is_diff:
                              type: integer
                              description: 是否去重
                            country:
                              type: string
                              description: 国家Code
                            countryName:
                              type: string
                              description: 国家名称
                            state:
                              type: string
                              description: 省/市
                            city:
                              type: string
                              description: 城市
                            type:
                              type: string
                            status:
                              type: string
                          required:
                            - password
                            - username
                            - id
                            - is_bind
                            - bindUser
                            - bindPassword
                            - createTime
                            - port
                            - agree
                            - target
                            - ip
                            - bill
                            - is_diff
                            - country
                            - countryName
                            - state
                            - city
                            - type
                            - status
                          x-apifox-orders:
                            - password
                            - username
                            - id
                            - is_bind
                            - bindUser
                            - bindPassword
                            - createTime
                            - port
                            - agree
                            - target
                            - ip
                            - bill
                            - is_diff
                            - country
                            - countryName
                            - state
                            - city
                            - type
                            - status
                        description: 响应内容
                      baseFlow:
                        type: number
                        description: 剩余基准流量
                      countryList:
                        type: array
                        items:
                          type: object
                          properties:
                            id:
                              type: integer
                            countryName:
                              type: string
                              description: 城市名称
                            country:
                              type: string
                              description: 城市编码
                            conutry:
                              type: string
                            type_text:
                              type: string
                            status_text:
                              type: string
                          required:
                            - id
                            - countryName
                            - conutry
                            - type_text
                            - status_text
                          x-apifox-orders:
                            - id
                            - countryName
                            - country
                            - conutry
                            - type_text
                            - status_text
                        description: 城市列表(用于城市搜索)
                    required:
                      - total
                      - rows
                      - baseFlow
                      - countryList
                    x-apifox-orders:
                      - total
                      - rows
                      - baseFlow
                      - countryList
                x-apifox-orders:
                  - code
                  - msg
                  - time
                  - data
                required:
                  - code
                  - msg
                  - time
                  - data
              example:
                code: 1
                msg: 获取成功
                time: '1697164784'
                data:
                  total: 1
                  rows:
                    - password: '111222'
                      username: demo-824
                      id: 824
                      is_bind: 否
                      bindUser: demo-824
                      bindPassword: '111222'
                      createTime: '2023-10-13 09:38:14'
                      port: 5001
                      agree: HTTP
                      target: demo.demo.com
                      ip: ''
                      bill: 0
                      is_diff: 0
                      country: ''
                      countryName: 全球
                      state: ''
                      city: ''
                      type: '0'
                      status: '0'
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
