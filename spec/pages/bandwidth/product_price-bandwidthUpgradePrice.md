# 带宽升级价格计算

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/product_price/bandwidthUpgradePrice:
    post:
      summary: 带宽升级价格计算
      deprecated: false
      description: ''
      tags:
        - 增值带宽
      parameters:
        - name: sub_accounts[]
          in: query
          description: 子账号id。数组传递
          required: true
          example:
            - '33'
            - '32'
          schema:
            type: array
            items:
              type: string
        - name: bandwidth_num
          in: query
          description: 要升级的带宽值，升级的带宽值要大于现在的带宽值
          required: true
          example: 20
          schema:
            type: integer
        - name: product_type_id
          in: query
          description: 产品类型。2=静态住宅（非原生）;3=静态住宅（原生）;4=静态住宅（运营商原生）
          required: true
          example: 3
          schema:
            type: integer
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
                    type: object
                    properties:
                      list:
                        type: array
                        items:
                          type: object
                          properties:
                            sub_account:
                              type: integer
                            original_bandwidth_num:
                              type: integer
                            bandwidth_num:
                              type: string
                            username:
                              type: string
                            current_set_meal_name:
                              type: string
                            upgrade_set_meal_name:
                              type: string
                            days:
                              type: integer
                            money:
                              type: string
                            bandwidth_price_settings_id:
                              type: integer
                            set_meal_bandwidth_id:
                              type: integer
                          required:
                            - sub_account
                            - original_bandwidth_num
                            - bandwidth_num
                            - username
                            - current_set_meal_name
                            - upgrade_set_meal_name
                            - days
                            - money
                            - bandwidth_price_settings_id
                            - set_meal_bandwidth_id
                          x-apifox-orders:
                            - sub_account
                            - original_bandwidth_num
                            - bandwidth_num
                            - username
                            - current_set_meal_name
                            - upgrade_set_meal_name
                            - days
                            - money
                            - bandwidth_price_settings_id
                            - set_meal_bandwidth_id
                      days:
                        type: integer
                      total_money:
                        type: string
                      use_custom_price_limit:
                        type: string
                      total_num:
                        type: integer
                    required:
                      - list
                      - days
                      - total_money
                      - use_custom_price_limit
                      - total_num
                    x-apifox-orders:
                      - list
                      - days
                      - total_money
                      - use_custom_price_limit
                      - total_num
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
                time: '1755159010'
                data:
                  list:
                    - sub_account: 65591
                      original_bandwidth_num: 5
                      bandwidth_num: '11'
                      username: zhizhuipsrt-65591
                      current_set_meal_name: 基础性
                      upgrade_set_meal_name: 标准型
                      days: 19
                      money: '57.00'
                      bandwidth_price_settings_id: 99
                      set_meal_bandwidth_id: 2
                    - sub_account: 65592
                      original_bandwidth_num: 5
                      bandwidth_num: '11'
                      username: zhizhuipsrt-65592
                      current_set_meal_name: 基础性
                      upgrade_set_meal_name: 标准型
                      days: 19
                      money: '57.00'
                      bandwidth_price_settings_id: 99
                      set_meal_bandwidth_id: 2
                  days: 38
                  total_money: '114.00'
                  use_custom_price_limit: '114.00'
                  total_num: 2
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 增值带宽
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-356575331-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
