# 获取用户价格

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/product_price/getProductUnitPrice:
    get:
      summary: 获取用户价格
      deprecated: false
      description: >-
        获取当前登录用户的各产品单价。返回数据 data
        按产品ID分组：1=动态住宅流量(不限时长)、2=静态住宅(普通)、3=静态住宅(本土原生)、4=静态住宅(运营商原生)、6=动态住宅流量(包月)、8=静态数据中心；customPriceBalance
        为价格优惠额度(商品价格超出后会使用原价)。时长类产品按天数档位(7/30/90/180/360)返回，每档含
        originUnitPrice(平台原价)、userUnitPrice(用户单价，未配置折扣时等于原价)。若给用户配置了按国家的自定义价格，天数档位下还会出现国家二字码子项(如
        "US")，结构与档位相同。
      tags:
        - 用户管理
      parameters:
        - name: token
          in: header
          description: 用户api key。<a href="/9518262m0" target="_blank">api key获取方式</a>
          required: true
          example: '{{access_token}}'
          schema:
            type: string
      responses:
        '200':
          x-apifox-name: 成功
          x-apifox-ordering: 0
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
                      '1':
                        type: object
                        properties:
                          originUnitPrice:
                            type: integer
                            description: 原价
                          userUnitPrice:
                            type: number
                            description: 客户价
                          isCustom:
                            type: boolean
                        required:
                          - originUnitPrice
                          - userUnitPrice
                          - isCustom
                        description: 流量套餐(不限时)
                        x-apifox-orders:
                          - originUnitPrice
                          - userUnitPrice
                          - isCustom
                      '2':
                        type: object
                        properties:
                          '7':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                          '30':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                          '90':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                          '180':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                          '360':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                        required:
                          - '7'
                          - '30'
                          - '90'
                          - '180'
                          - '360'
                        description: 静态住宅(普通)
                        x-apifox-orders:
                          - '7'
                          - '30'
                          - '90'
                          - '180'
                          - '360'
                      '3':
                        type: object
                        properties:
                          '7':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                              US:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: number
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                              GB:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                              IN:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                              CA:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                              - GB
                              - IN
                              - CA
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                              - GB
                              - IN
                              - CA
                          '30':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                              US:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                              GB:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                              IN:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: number
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                              CA:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                              - GB
                              - IN
                              - CA
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                              - GB
                              - IN
                              - CA
                          '90':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                              US:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                              GB:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: number
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                              IN:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: number
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                              CA:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                              - GB
                              - IN
                              - CA
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                              - GB
                              - IN
                              - CA
                          '180':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                              US:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: number
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                              GB:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: number
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                              IN:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                              CA:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                              - GB
                              - IN
                              - CA
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                              - GB
                              - IN
                              - CA
                          '360':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                              US:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: number
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                              GB:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                              IN:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: number
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                              CA:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                              - GB
                              - IN
                              - CA
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                              - GB
                              - IN
                              - CA
                        required:
                          - '7'
                          - '30'
                          - '90'
                          - '180'
                          - '360'
                        description: 静态住宅(原生)
                        x-apifox-orders:
                          - '7'
                          - '30'
                          - '90'
                          - '180'
                          - '360'
                      '4':
                        type: object
                        properties:
                          '7':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                              US:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: number
                                  userUnitPrice:
                                    type: number
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                          '30':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                              US:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                          '90':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                              US:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                          '180':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                              US:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                          '360':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                              US:
                                type: object
                                properties:
                                  originUnitPrice:
                                    type: integer
                                  userUnitPrice:
                                    type: integer
                                  isCustom:
                                    type: boolean
                                required:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                                x-apifox-orders:
                                  - originUnitPrice
                                  - userUnitPrice
                                  - isCustom
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                              - US
                        required:
                          - '7'
                          - '30'
                          - '90'
                          - '180'
                          - '360'
                        description: 静态住宅(运营商原生)
                        x-apifox-orders:
                          - '7'
                          - '30'
                          - '90'
                          - '180'
                          - '360'
                      '6':
                        type: object
                        properties:
                          '30':
                            type: object
                            properties:
                              originUnitPrice:
                                type: string
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                          '90':
                            type: object
                            properties:
                              originUnitPrice:
                                type: string
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                          '180':
                            type: object
                            properties:
                              originUnitPrice:
                                type: string
                              userUnitPrice:
                                type: integer
                              isCustom:
                                type: boolean
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                        required:
                          - '30'
                          - '90'
                          - '180'
                        description: 流量套餐(限时)
                        x-apifox-orders:
                          - '30'
                          - '90'
                          - '180'
                      '8':
                        type: object
                        properties:
                          '7':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: number
                              isCustom:
                                type: boolean
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                          '30':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: number
                              isCustom:
                                type: boolean
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                          '90':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: number
                              isCustom:
                                type: boolean
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                          '180':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: number
                              isCustom:
                                type: boolean
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                          '360':
                            type: object
                            properties:
                              originUnitPrice:
                                type: integer
                              userUnitPrice:
                                type: number
                              isCustom:
                                type: boolean
                            required:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                            x-apifox-orders:
                              - originUnitPrice
                              - userUnitPrice
                              - isCustom
                        required:
                          - '7'
                          - '30'
                          - '90'
                          - '180'
                          - '360'
                        description: 数据中心
                        x-apifox-orders:
                          - '7'
                          - '30'
                          - '90'
                          - '180'
                          - '360'
                      customPriceBalance:
                        type: number
                        description: 优惠额度(商品价格超出后会使用原价)
                    required:
                      - '1'
                      - '2'
                      - '3'
                      - '4'
                      - '6'
                      - '8'
                      - customPriceBalance
                    x-apifox-orders:
                      - '1'
                      - '2'
                      - '3'
                      - '4'
                      - '6'
                      - '8'
                      - customPriceBalance
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
                msg: ok
                time: '1790491453'
                data:
                  '1':
                    originUnitPrice: 30
                    userUnitPrice: 0.01
                    isCustom: true
                  '2':
                    '7':
                      originUnitPrice: 30
                      userUnitPrice: 10
                      isCustom: true
                    '30':
                      originUnitPrice: 60
                      userUnitPrice: 15
                      isCustom: true
                    '90':
                      originUnitPrice: 150
                      userUnitPrice: 20
                      isCustom: true
                    '180':
                      originUnitPrice: 300
                      userUnitPrice: 30
                      isCustom: true
                    '360':
                      originUnitPrice: 540
                      userUnitPrice: 40
                      isCustom: true
                  '3':
                    '7':
                      originUnitPrice: 30
                      userUnitPrice: 30
                      isCustom: false
                      US:
                        originUnitPrice: 30
                        userUnitPrice: 0.01
                        isCustom: true
                      GB:
                        originUnitPrice: 39
                        userUnitPrice: 19
                        isCustom: true
                      IN:
                        originUnitPrice: 45
                        userUnitPrice: 21
                        isCustom: true
                      CA:
                        originUnitPrice: 35
                        userUnitPrice: 9
                        isCustom: true
                    '30':
                      originUnitPrice: 60
                      userUnitPrice: 60
                      isCustom: false
                      US:
                        originUnitPrice: 60
                        userUnitPrice: 1
                        isCustom: true
                      GB:
                        originUnitPrice: 79
                        userUnitPrice: 50
                        isCustom: true
                      IN:
                        originUnitPrice: 89
                        userUnitPrice: 21.99
                        isCustom: true
                      CA:
                        originUnitPrice: 80
                        userUnitPrice: 80
                        isCustom: false
                    '90':
                      originUnitPrice: 150
                      userUnitPrice: 150
                      isCustom: false
                      US:
                        originUnitPrice: 150
                        userUnitPrice: 89
                        isCustom: true
                      GB:
                        originUnitPrice: 199
                        userUnitPrice: 58.96
                        isCustom: true
                      IN:
                        originUnitPrice: 229
                        userUnitPrice: 22.99
                        isCustom: true
                      CA:
                        originUnitPrice: 230
                        userUnitPrice: 230
                        isCustom: false
                    '180':
                      originUnitPrice: 300
                      userUnitPrice: 300
                      isCustom: false
                      US:
                        originUnitPrice: 300
                        userUnitPrice: 229.98
                        isCustom: true
                      GB:
                        originUnitPrice: 379
                        userUnitPrice: 78.95
                        isCustom: true
                      IN:
                        originUnitPrice: 427
                        userUnitPrice: 24
                        isCustom: true
                      CA:
                        originUnitPrice: 430
                        userUnitPrice: 430
                        isCustom: false
                    '360':
                      originUnitPrice: 540
                      userUnitPrice: 540
                      isCustom: false
                      US:
                        originUnitPrice: 540
                        userUnitPrice: 449.98
                        isCustom: true
                      GB:
                        originUnitPrice: 729
                        userUnitPrice: 99
                        isCustom: true
                      IN:
                        originUnitPrice: 829
                        userUnitPrice: 24.95
                        isCustom: true
                      CA:
                        originUnitPrice: 800
                        userUnitPrice: 800
                        isCustom: false
                  '4':
                    '7':
                      originUnitPrice: 30
                      userUnitPrice: 30
                      isCustom: false
                      US:
                        originUnitPrice: 34.5
                        userUnitPrice: 34.5
                        isCustom: false
                    '30':
                      originUnitPrice: 60
                      userUnitPrice: 60
                      isCustom: false
                      US:
                        originUnitPrice: 69
                        userUnitPrice: 30
                        isCustom: true
                    '90':
                      originUnitPrice: 150
                      userUnitPrice: 150
                      isCustom: false
                      US:
                        originUnitPrice: 196
                        userUnitPrice: 196
                        isCustom: false
                    '180':
                      originUnitPrice: 300
                      userUnitPrice: 300
                      isCustom: false
                      US:
                        originUnitPrice: 372
                        userUnitPrice: 372
                        isCustom: false
                    '360':
                      originUnitPrice: 540
                      userUnitPrice: 540
                      isCustom: false
                      US:
                        originUnitPrice: 703
                        userUnitPrice: 703
                        isCustom: false
                  '6':
                    '30':
                      originUnitPrice: '27.00'
                      userUnitPrice: 5
                      isCustom: true
                    '90':
                      originUnitPrice: '28.00'
                      userUnitPrice: 8
                      isCustom: true
                    '180':
                      originUnitPrice: '29.00'
                      userUnitPrice: 7
                      isCustom: true
                  '7':
                    originUnitPrice: 2.5
                    userUnitPrice: 2.5
                    isCustom: false
                  '8':
                    '7':
                      originUnitPrice: 22
                      userUnitPrice: 0.01
                      isCustom: true
                    '30':
                      originUnitPrice: 45
                      userUnitPrice: 20.8
                      isCustom: true
                    '90':
                      originUnitPrice: 122
                      userUnitPrice: 70.9
                      isCustom: true
                    '180':
                      originUnitPrice: 230
                      userUnitPrice: 110.1
                      isCustom: true
                    '360':
                      originUnitPrice: 405
                      userUnitPrice: 160.11
                      isCustom: true
                  customPriceBalance: 9491.17
          headers: {}
      security: []
      x-apifox-folder: 用户管理
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-389339469-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
