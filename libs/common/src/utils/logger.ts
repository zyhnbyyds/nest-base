import { FastifyRequest } from 'fastify'

export interface LogExtraMsg {
  message: string
  logLevel: string
}

/**
 * 将请求对象转换为日志记录对象
 * @param request
 * @param options
 * @returns
 */
export function transReqToLogRecord(request: FastifyRequest, options: Partial<LogExtraMsg> = {}) {
  const { method, url, headers, ip, body, params, query } = request
  const payload = { params, query, body }

  return {
    logLevel: options?.logLevel ?? 'info', // 这里可以根据实际情况动态设置日志级别
    message: options?.message ?? '', // 你可以自定义日志信息
    serviceName: 'YourServiceName', // 服务名称，手动填写或从配置中读取
    methodName: method, // 请求的 HTTP 方法，例如 GET, POST 等
    requestId: (headers['x-request-id'] || '') as string, // 请求 ID，通常通过自定义请求头传递
    traceId: (headers['x-trace-id'] || '') as string, // 分布式系统中的跟踪 ID
    spanId: (headers['x-span-id'] || '') as string, // 分布式系统中的跨度 ID
    parentSpanId: (headers['x-parent-span-id'] || '') as string, // 父跨度 ID
    statusCode: 200, // 可以根据实际响应状态码动态设置
    hostName: request.hostname, // 请求主机名
    ipAddress: ip, // 请求来源 IP
    userAgent: headers['user-agent'], // 请求头中的 User-Agent
    requestPath: url, // 请求的路径
    executionTime: null, // 如果有执行时间的话，你可以在结束时设置
    context: body ? JSON.stringify(payload) : null, // 请求体，存储为 JSON 格式
    createdAt: new Date(), // 日志创建时间
  }
}
