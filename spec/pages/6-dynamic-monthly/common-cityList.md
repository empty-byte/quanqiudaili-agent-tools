# 获取动态住宅（包月）对应城市列表

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/common/cityList:
    get:
      summary: 获取动态住宅（包月）对应城市列表
      deprecated: false
      description: 获取动态住宅（包月）对应城市列表
      tags:
        - 用户IP子账号管理/动态住宅流量子账号 （包月）
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型id，此处固定类别为：6
          required: true
          example: 6
          schema:
            type: integer
        - name: country_code
          in: query
          description: >-
            国家编码，例如：US。从<a href='/api-222526763'
            target='_blank'>动态住宅（包月）国家列表</a>获取
          required: true
          example: US
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
                    description: 响应说明
                  time:
                    type: string
                  data:
                    type: array
                    items:
                      type: object
                      properties:
                        name:
                          type: string
                          description: 城市名称
                        code:
                          type: string
                          description: 城市编码
                        state_name:
                          type: string
                          description: 州、省名称
                        country_name:
                          type: string
                          description: 国家名称
                      required:
                        - name
                        - code
                        - state_name
                        - country_name
                      x-apifox-orders:
                        - name
                        - code
                        - state_name
                        - country_name
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
                msg: 获取成功!
                time: '1790487682'
                data:
                  - name: Cammack Village
                    code: Cammack Village
                    state_name: Arkansas
                    country_name: 美国
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅流量子账号 （包月）
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222526764-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
