# 查询产品信息

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/conpons/getProductList:
    get:
      summary: 查询产品信息
      deprecated: false
      description: 查询产品信息
      tags:
        - 工具管理
      parameters:
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
                        suffix:
                          type: string
                        native_text:
                          type: 'null'
                      required:
                        - id
                        - name
                        - suffix
                        - native_text
                required:
                  - code
                  - msg
                  - time
                  - data
              example:
                code: 1
                msg: 获取成功!
                time: '1790491344'
                data:
                  - id: 1
                    name: 全球动态住宅 - 按流量计费(不限时长)
                    suffix: drf
                    native_text: null
                  - id: 2
                    name: 独享静态住宅（普通）
                    suffix: srtisp
                    native_text: null
                  - id: 3
                    name: 独享静态住宅（本土原生）
                    suffix: srtisp
                    native_text: null
                  - id: 4
                    name: 独享静态住宅（运营商原生）
                    suffix: srtisp
                    native_text: null
                  - id: 6
                    name: 全球动态住宅 - 按流量计费(包月)
                    suffix: drft
                    native_text: null
                  - id: 8
                    name: 独享静态数据中心
                    suffix: sctisp
                    native_text: null
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 工具管理
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222490578-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
