# 获取数据中心地区库存详情

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/inventory/getBuyProductSku:
    get:
      summary: 获取数据中心地区库存详情
      deprecated: false
      description: 获取数据中心地区库存详情
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
        - name: country_code
          in: query
          description: 国家code。
          required: true
          example: US
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
                        country_id:
                          type: integer
                        city_id:
                          type: integer
                        country_name:
                          type: string
                        country_code:
                          type: string
                        city_name:
                          type: string
                        city_code:
                          type: string
                        use_random_city:
                          type: integer
                        remark:
                          type: string
                        sku_status:
                          type: integer
                required:
                  - code
                  - msg
                  - time
                  - data
              examples:
                '1':
                  summary: 成功示例
                  value:
                    code: 1
                    msg: ok
                    time: '1790492962'
                    data:
                      - country_id: 1905
                        city_id: 0
                        country_name: 美国
                        country_code: US
                        city_name: ''
                        city_code: ''
                        use_random_city: 1
                        remark: 紧缺
                        sku_status: 1
                '2':
                  summary: 成功示例
                  value:
                    code: 1
                    msg: ok
                    time: '1750044858'
                    data:
                      - country_id: 1770
                        city_id: 3002835
                        num: 1986
                        country_name: 中国香港
                        country_code: HK
                        city_name: Hong Kong
                        use_random_city: 1
                        remark: 充足
                        sku_status: 0
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/数据中心时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-309091222-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
