# 子账号带宽趋势查询

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/bandwidth/monitoringTrend:
    get:
      summary: 子账号带宽趋势查询
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
          example: 33
          schema:
            type: integer
        - name: trend_type
          in: query
          description: >-
            带宽监控趋势类型:1=实时，固定取最近 60 分钟，忽略 startTime/endTime；2=历史，按
            startTime/endTime 取
          required: true
          example: 1
          schema:
            type: integer
        - name: startTime
          in: query
          description: 开始时间。历史趋势可选，不传默认最近 1 天；跨度不能超过 2 天
          required: false
          example: '1755273600'
          schema:
            type: string
        - name: endTime
          in: query
          description: 结束时间。历史趋势可选，不传默认最近 1 天；跨度不能超过 2 天
          required: false
          example: '1755273601'
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
                    type: object
                    properties:
                      bandwidthList:
                        type: array
                        items:
                          type: object
                          properties:
                            downstreamTraffic:
                              type: integer
                              title: 下行流量
                            time:
                              type: string
                              title: 时间
                            upstreamTraffic:
                              type: integer
                              title: 上行流量
                          required:
                            - downstreamTraffic
                            - time
                            - upstreamTraffic
                          x-apifox-orders:
                            - downstreamTraffic
                            - time
                            - upstreamTraffic
                        title: 带宽列表
                      currentBandwidth:
                        type: integer
                        title: 当前实时带宽
                      peakBandwidth:
                        type: integer
                        title: 峰值带宽
                    required:
                      - bandwidthList
                      - currentBandwidth
                      - peakBandwidth
                    x-apifox-orders:
                      - bandwidthList
                      - currentBandwidth
                      - peakBandwidth
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
                    time: '1755321650'
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
                      reqParams:
                        endTime: '2025-08-16 13:18:31'
                        intervalType: fixed
                        intervalUnit: h
                        intervalValue: 1
                        startTime: '2025-08-16 00:00:00'
                        timeZone: Asia/Shanghai
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
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-356575334-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
