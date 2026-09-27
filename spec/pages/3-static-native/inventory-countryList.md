# 获取静态住宅（原生）对应国家列表

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/inventory/countryList:
    get:
      summary: 获取静态住宅（原生）对应国家列表
      deprecated: false
      description: 获取静态住宅（原生）时长对应国家列表
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
                        code:
                          type: string
                      required:
                        - id
                        - name
                        - code
                required:
                  - code
                  - msg
                  - time
                  - data
              example:
                code: 1
                msg: 获取成功!
                time: '1790492920'
                data:
                  - id: 611
                    name: 澳大利亚
                    code: AU
                  - id: 614
                    name: 巴西
                    code: BR
                  - id: 616
                    name: 加拿大
                    code: CA
                  - id: 620
                    name: 丹麦
                    code: DK
                  - id: 622
                    name: 法国
                    code: FR
                  - id: 623
                    name: 德国
                    code: DE
                  - id: 626
                    name: 中国香港
                    code: HK
                  - id: 627
                    name: 匈牙利
                    code: HU
                  - id: 628
                    name: 印度
                    code: IN
                  - id: 629
                    name: 印度尼西亚
                    code: ID
                  - id: 630
                    name: 意大利
                    code: IT
                  - id: 631
                    name: 日本
                    code: JP
                  - id: 633
                    name: 韩国
                    code: KR
                  - id: 635
                    name: 马来西亚
                    code: MY
                  - id: 639
                    name: 巴基斯坦
                    code: PK
                  - id: 640
                    name: 菲律宾
                    code: PH
                  - id: 644
                    name: 沙特阿拉伯
                    code: SA
                  - id: 645
                    name: 新加坡
                    code: SG
                  - id: 646
                    name: 南非
                    code: ZA
                  - id: 647
                    name: 西班牙
                    code: ES
                  - id: 649
                    name: 中国台湾省
                    code: TW
                  - id: 650
                    name: 泰国
                    code: TH
                  - id: 651
                    name: 阿联酋
                    code: AE
                  - id: 652
                    name: 英国
                    code: GB
                  - id: 653
                    name: 美国
                    code: US
                  - id: 654
                    name: 越南
                    code: VN
                  - id: 908
                    name: 荷兰
                    code: NL
                  - id: 1165
                    name: 土耳其
                    code: TR
                  - id: 1166
                    name: 以色列
                    code: IL
                  - id: 1167
                    name: 保加利亚
                    code: BG
                  - id: 1172
                    name: 墨西哥
                    code: MX
                  - id: 1173
                    name: 波兰
                    code: PL
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/静态住宅（原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-245746641-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
