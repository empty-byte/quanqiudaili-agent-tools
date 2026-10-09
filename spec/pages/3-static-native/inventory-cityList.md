# 获取静态住宅（原生）对应城市列表

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/inventory/cityList:
    get:
      summary: 获取静态住宅（原生）对应城市列表
      deprecated: false
      description: 获取静态住宅（原生）时长对应城市列表
      tags:
        - 用户IP子账号管理/静态住宅（原生）时长子账号
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型id，此处固定为：3
          required: true
          example: 3
          schema:
            type: integer
        - name: country_id
          in: query
          description: >-
            国家id。可从<a href='/api-245746641'
            target='_blank'>静态住宅（原生）国家列表获取</a>。都可以不传，不传返回该产品全部城市；传一个就按该国家筛选；两个都传必须是同一个国家，否则报错
          required: false
          example: '653'
          schema:
            type: string
        - name: country_code
          in: query
          description: >-
            国家code。可从<a href='/api-245746641'
            target='_blank'>静态住宅（原生）国家列表获取</a>。都可以不传，不传返回该产品全部城市；传一个就按该国家筛选；两个都传必须是同一个国家，否则报错
          required: false
          example: US
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
                        id:
                          type: integer
                        name:
                          type: string
                          description: 城市名称
                        code:
                          type: string
                          description: 城市code
                        country_id:
                          type: integer
                        country_code:
                          type: string
                      required:
                        - id
                        - name
                        - code
                        - country_id
                        - country_code
                      x-apifox-orders:
                        - id
                        - name
                        - code
                        - country_id
                        - country_code
                      description: 城市列表
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
                time: '1790496981'
                data:
                  - id: 3902
                    name: New York City
                    code: New York City
                    country_id: 653
                    country_code: US
                  - id: 3905
                    name: Chicago
                    code: Chicago
                    country_id: 653
                    country_code: US
                  - id: 3906
                    name: Seattle
                    code: Seattle
                    country_id: 653
                    country_code: US
                  - id: 3909
                    name: Dallas
                    code: Dallas
                    country_id: 653
                    country_code: US
                  - id: 3910
                    name: Houston
                    code: Houston
                    country_id: 653
                    country_code: US
                  - id: 3911
                    name: Los Angeles
                    code: Los Angeles
                    country_id: 653
                    country_code: US
                  - id: 3912
                    name: San Francisco
                    code: San Francisco
                    country_id: 653
                    country_code: US
                  - id: 3913
                    name: Las Vegas
                    code: Las Vegas
                    country_id: 653
                    country_code: US
                  - id: 3914
                    name: Phoenix
                    code: Phoenix
                    country_id: 653
                    country_code: US
                  - id: 3915
                    name: Washington
                    code: Washington
                    country_id: 653
                    country_code: US
                  - id: 3916
                    name: Boston
                    code: Boston
                    country_id: 653
                    country_code: US
                  - id: 3917
                    name: Philadelphia
                    code: Philadelphia
                    country_id: 653
                    country_code: US
                  - id: 3950
                    name: Columbia
                    code: Columbia
                    country_id: 653
                    country_code: US
                  - id: 8745
                    name: Denver
                    code: Denver
                    country_id: 653
                    country_code: US
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/静态住宅（原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-245746642-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
