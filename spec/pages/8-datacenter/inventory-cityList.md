# 获取数据中心对应城市列表

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
      summary: 获取数据中心对应城市列表
      deprecated: false
      description: 获取数据中心时长对应城市列表
      tags:
        - 用户IP子账号管理/数据中心时长子账号
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型id，此处固定为：8
          required: true
          example: 8
          schema:
            type: integer
        - name: country_id
          in: query
          description: >-
            国家id。可从<a href='/api-222488747'
            target='_blank'>数据中心国家列表获取</a>。都可以不传，不传返回该产品全部城市；传一个就按该国家筛选；两个都传必须是同一个国家，否则报错
          required: false
          example: '1804'
          schema:
            type: string
        - name: country_code
          in: query
          description: >-
            国家code。可从<a href='/api-222488747'
            target='_blank'>数据中心国家列表获取</a>。都可以不传，不传返回该产品全部城市；传一个就按该国家筛选；两个都传必须是同一个国家，否则报错
          required: false
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
                  msg:
                    type: string
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
                          description: 城市编码
                        country_id:
                          type: integer
                          description: 国家id
                        country_code:
                          type: string
                          description: 国家编码
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
                time: '1790486984'
                data:
                  - id: 3920
                    name: New York City
                    code: New York City
                    country_id: 565
                    country_code: US
                  - id: 3923
                    name: Chino
                    code: Chino
                    country_id: 565
                    country_code: US
                  - id: 3924
                    name: La Mirada
                    code: La Mirada
                    country_id: 565
                    country_code: US
                  - id: 3936
                    name: Los Angeles
                    code: Los Angeles
                    country_id: 565
                    country_code: US
                  - id: 3937
                    name: Washington
                    code: Washington
                    country_id: 565
                    country_code: US
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/数据中心时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222488748-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
