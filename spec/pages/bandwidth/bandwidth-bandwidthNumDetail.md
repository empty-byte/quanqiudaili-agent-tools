# 获取剩余有效期内的带宽详情

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/bandwidth/bandwidthNumDetail:
    get:
      summary: 获取剩余有效期内的带宽详情
      deprecated: false
      description: ''
      tags:
        - 增值带宽
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型。2=静态住宅（非原生）;3=静态住宅（原生）;4=静态住宅（运营商原生）
          required: true
          example: 3
          schema:
            type: integer
        - name: subAccount
          in: query
          description: 子账号id
          required: true
          example: 3
          schema:
            type: integer
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
                            id:
                              type: integer
                            max_bandwidth:
                              type: integer
                              title: 峰值带宽
                            min_bandwidth:
                              type: integer
                              title: 保底带宽
                            start_time:
                              type: integer
                              title: 开始时间
                            end_time:
                              type: integer
                              title: 结束时间
                            start_time_text:
                              type: string
                              title: 开始时间
                            end_time_text:
                              type: string
                              title: 结束时间
                            create_time:
                              type: integer
                              title: 创建时间
                            update_time:
                              type: integer
                              title: 更新时间
                            create_time_text:
                              type: string
                              title: 创建时间
                            update_time_text:
                              type: string
                              title: 更新时间
                          required:
                            - id
                            - max_bandwidth
                            - min_bandwidth
                            - start_time
                            - end_time
                            - start_time_text
                            - end_time_text
                            - create_time
                            - update_time
                            - create_time_text
                            - update_time_text
                          x-apifox-orders:
                            - id
                            - max_bandwidth
                            - min_bandwidth
                            - start_time
                            - end_time
                            - start_time_text
                            - end_time_text
                            - create_time
                            - update_time
                            - create_time_text
                            - update_time_text
                        description: 在有效期内的详情情况
                      end_time:
                        type: integer
                        description: 子账号的结束时间
                      end_time_text:
                        type: string
                        description: 子账号的结束时间
                      current_max_bandwidth:
                        type: integer
                        description: 当前峰值带宽
                      current_min_bandwidth:
                        type: integer
                        description: 当前保底带宽
                      current_cycle_end_time:
                        type: integer
                        description: 当前带宽结束时间节点
                      current_cycle_end_time_text:
                        type: string
                        description: 当前带宽结束时间节点
                      cycle_min_bandwidth_maximum:
                        type: integer
                        description: 子账号结束周期内保底带宽的最大值
                    required:
                      - list
                      - end_time
                      - end_time_text
                      - current_max_bandwidth
                      - current_min_bandwidth
                      - current_cycle_end_time
                      - current_cycle_end_time_text
                      - cycle_min_bandwidth_maximum
                    x-apifox-orders:
                      - list
                      - end_time
                      - end_time_text
                      - current_max_bandwidth
                      - current_min_bandwidth
                      - current_cycle_end_time
                      - current_cycle_end_time_text
                      - cycle_min_bandwidth_maximum
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
              examples:
                '1':
                  summary: 成功示例
                  value:
                    code: 1
                    msg: 获取成功!
                    time: '1790490757'
                    data:
                      list:
                        - id: 330879
                          max_bandwidth: 100
                          min_bandwidth: 5
                          start_time: 1790487449
                          end_time: 1791092248
                          start_time_text: '2026-09-27 13:37:29'
                          end_time_text: '2026-10-04 13:37:28'
                          create_time: 1790487449
                          update_time: 1790487449
                          create_time_text: '2026-09-27 13:37:29'
                          update_time_text: '2026-09-27 13:37:29'
                        - id: 330880
                          max_bandwidth: 100
                          min_bandwidth: 5
                          start_time: 1791092248
                          end_time: 1791697048
                          start_time_text: '2026-10-04 13:37:28'
                          end_time_text: '2026-10-11 13:37:28'
                          create_time: 1790490027
                          update_time: 1790490027
                          create_time_text: '2026-09-27 14:20:27'
                          update_time_text: '2026-09-27 14:20:27'
                      end_time: 1791697048
                      end_time_text: '2026-10-11 13:37:28'
                      current_max_bandwidth: 100
                      current_min_bandwidth: 5
                      current_cycle_end_time: 1791092248
                      current_cycle_end_time_text: '2026-10-04 13:37:28'
                      cycle_min_bandwidth_maximum: 5
                '2':
                  summary: 成功示例
                  value:
                    code: 1
                    msg: 获取成功!
                    time: '1755321775'
                    data:
                      bandwidthList:
                        - downstreamTraffic: 0
                          time: 2025-08-16 00
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 01
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 02
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 03
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 04
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 05
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 06
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 07
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 08
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 09
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 10
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 11
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 12
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 13
                          upstreamTraffic: 0
                      currentBandwidth: 0
                      peakBandwidth: 0
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 增值带宽
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-356598388-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
