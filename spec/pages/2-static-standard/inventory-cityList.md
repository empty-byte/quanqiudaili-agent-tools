# 获取静态住宅（普通非原生）对应城市列表

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
      summary: 获取静态住宅（普通非原生）对应城市列表
      deprecated: false
      description: 获取静态住宅（普通非原生）时长对应城市列表
      tags:
        - 用户IP子账号管理/静态住宅（普通非原生）时长子账号
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型id，此处固定为：2
          required: true
          example: 2
          schema:
            type: integer
        - name: country_id
          in: query
          description: >-
            国家id。可从<a href='/api-222487309'
            target='_blank'>静态住宅（普通非原生）国家列表获取</a>。都可以不传，不传返回该产品全部城市；传一个就按该国家筛选；两个都传必须是同一个国家，否则报错
          required: false
          example: '1905'
          schema:
            type: string
        - name: country_code
          in: query
          description: >-
            国家code。可从<a href='/api-222487309'
            target='_blank'>静态住宅（普通非原生）国家列表获取</a>。都可以不传，不传返回该产品全部城市；传一个就按该国家筛选；两个都传必须是同一个国家，否则报错
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
                          description: 城市编码
                        country_id:
                          type: integer
                          description: 国家id
                        country_code:
                          type: string
                          description: 国家编码
                      x-apifox-orders:
                        - id
                        - name
                        - code
                        - country_id
                        - country_code
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
                time: '1790487138'
                data:
                  - id: 3891
                    name: Hong Kong
                    code: Hong Kong
                    country_id: 582
                    country_code: HK
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/静态住宅（普通非原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222487647-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
