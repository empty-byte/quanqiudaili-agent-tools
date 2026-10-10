# 获取用户信息

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/user/getUserInfo:
    get:
      summary: 获取用户信息
      deprecated: false
      description: 获取用户信息
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
                      realName:
                        type: string
                      nextLevel:
                        type: integer
                      nextLevelStartPoint:
                        type: integer
                      withdrawalAmount:
                        type: number
                      last3WithdrawalAmount:
                        type: integer
                      id:
                        type: integer
                        description: 用户id
                      username:
                        type: string
                        description: 用户名
                      nickname:
                        type: string
                        description: 昵称
                      email:
                        type: string
                        description: 用户邮箱
                      mobile:
                        type: string
                        description: 手机号
                      avatar:
                        type: string
                        description: 头像
                      money:
                        type: string
                        description: 账户余额
                      mobile_verify:
                        type: integer
                        description: 手机号码是否验证。0=未验证，1=已验证
                      email_verify:
                        type: integer
                        description: 邮件是否验证。0=未验证，1=已验证
                      auth_verify:
                        type: integer
                        description: 是否实名。0=未实名。1=已实名
                      user_group:
                        type: string
                        description: 用户组。0=普通用户组，1=金牌代理商，2=银牌代理商
                      fid:
                        type: integer
                        description: 父id
                      ref_level1_user_id:
                        type: integer
                      ref_level2_user_id:
                        type: integer
                      valid_point:
                        type: integer
                        description: 有效积分
                      history_total_point:
                        type: integer
                        description: 历史总积分
                      promote_valid_date:
                        type: string
                        description: 推广有效期
                      level:
                        type: integer
                      ref:
                        type: string
                        description: 推广链接
                      agent_user_type:
                        type: string
                      wechat_mp_openid:
                        type: string
                      is_sms_notify_on:
                        type: integer
                      level2_agent_category:
                        type: string
                      level2_agent_add_verify:
                        type: string
                      password_type:
                        type: integer
                      isCustomerServiceSet:
                        type: integer
                      promotionCode:
                        type: string
                      unreadMessageCount:
                        type: integer
                      todoListCount:
                        type: integer
                    required:
                      - realName
                      - nextLevel
                      - nextLevelStartPoint
                      - withdrawalAmount
                      - last3WithdrawalAmount
                      - id
                      - username
                      - nickname
                      - email
                      - mobile
                      - avatar
                      - money
                      - mobile_verify
                      - email_verify
                      - auth_verify
                      - user_group
                      - fid
                      - ref_level1_user_id
                      - ref_level2_user_id
                      - valid_point
                      - history_total_point
                      - promote_valid_date
                      - level
                      - ref
                      - agent_user_type
                      - wechat_mp_openid
                      - is_sms_notify_on
                      - level2_agent_category
                      - level2_agent_add_verify
                      - password_type
                      - isCustomerServiceSet
                      - promotionCode
                      - unreadMessageCount
                      - todoListCount
                    x-apifox-orders:
                      - realName
                      - nextLevel
                      - nextLevelStartPoint
                      - withdrawalAmount
                      - last3WithdrawalAmount
                      - id
                      - username
                      - nickname
                      - email
                      - mobile
                      - avatar
                      - money
                      - mobile_verify
                      - email_verify
                      - auth_verify
                      - user_group
                      - fid
                      - ref_level1_user_id
                      - ref_level2_user_id
                      - valid_point
                      - history_total_point
                      - promote_valid_date
                      - level
                      - ref
                      - agent_user_type
                      - wechat_mp_openid
                      - is_sms_notify_on
                      - level2_agent_category
                      - level2_agent_add_verify
                      - password_type
                      - isCustomerServiceSet
                      - promotionCode
                      - unreadMessageCount
                      - todoListCount
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
                time: '1790497115'
                data:
                  realName: xxx
                  nextLevel: 2
                  nextLevelStartPoint: 100001
                  withdrawalAmount: 0
                  last3WithdrawalAmount: 0
                  id: 1
                  username: xxx
                  nickname: xxx
                  email: xxx@xxx.com
                  mobile: xxxxxx
                  avatar: https://admin.quanqiudaili.com/xxxxxxxx
                  money: '0'
                  mobile_verify: 1
                  email_verify: 1
                  auth_verify: 1
                  user_group: '1'
                  fid: 0
                  ref_level1_user_id: 0
                  ref_level2_user_id: 0
                  valid_point: 0
                  history_total_point: 0
                  promote_valid_date: '2028-01-25 00:00:00'
                  level: 1
                  ref: xxxx
                  agent_user_type: '1'
                  wechat_mp_openid: xxxx-xxxx
                  is_sms_notify_on: 0
                  level2_agent_category: user
                  level2_agent_add_verify: '0'
                  password_type: 1
                  isCustomerServiceSet: 1
                  promotionCode: xxxxxx
                  unreadMessageCount: 0
                  todoListCount: 0
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户管理
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222033983-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
