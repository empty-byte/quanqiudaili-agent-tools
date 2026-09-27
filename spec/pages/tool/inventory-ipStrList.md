# 查询IP段列表

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/inventory/ipStrList:
    post:
      summary: 查询IP段列表
      deprecated: false
      description: 获取IP段列表
      tags:
        - 工具管理
      parameters:
        - name: product_type_id
          in: query
          description: ''
          required: false
          example: '3'
          schema:
            type: string
        - name: country_code
          in: query
          description: ''
          required: false
          example: US
          schema:
            type: string
        - name: city_code
          in: query
          description: ''
          required: false
          example: Los Angeles
          schema:
            type: string
        - name: ip_str
          in: query
          description: ''
          required: false
          example: '38'
          schema:
            type: string
        - name: exclude_ip_str
          in: query
          description: ''
          required: false
          example: '38.31'
          schema:
            type: string
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
                  description: 产品id:2=静态住宅（非原生）;3=静态住宅（原生）;4=静态住宅（运营商原生）;8=数据中心
                  example: '3'
                  type: string
                country_code:
                  description: 国家code
                  example: US
                  type: string
                city_code:
                  description: 城市code
                  example: Los Angeles
                  type: string
                ip_str:
                  description: IP段前缀，写前 1 到 2 段，如 38 或 38.30
                  example: '38'
                  type: string
                exclude_ip_str:
                  description: 需要排除掉的ip段
                  example: '38.31'
                  type: string
              required:
                - product_type_id
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
                      current_page:
                        type: integer
                      last_page:
                        type: integer
                      total:
                        type: integer
                        description: 总数
                      data:
                        type: array
                        items:
                          type: object
                          properties:
                            ipStr:
                              type: string
                              description: IP段
                            type:
                              type: integer
                            remark:
                              type: string
                              description: 库存备注
                            skuStatus:
                              type: integer
                              description: 库存标识:0=充足,1=紧缺
                          required:
                            - ipStr
                            - type
                            - remark
                            - skuStatus
                          x-apifox-orders:
                            - ipStr
                            - type
                            - remark
                            - skuStatus
                    required:
                      - current_page
                      - last_page
                      - total
                      - data
                    x-apifox-orders:
                      - current_page
                      - last_page
                      - total
                      - data
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
                msg: 库存获取成功!
                time: '1790489215'
                data:
                  current_page: 1
                  last_page: 3
                  total: 24
                  data:
                    - ipStr: '38.30'
                      type: 1
                      remark: 紧张
                      skuStatus: 1
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 工具管理
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-303563504-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
