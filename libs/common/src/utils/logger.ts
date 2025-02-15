import type { LoggerOptions } from 'winston'
import { pid } from 'node:process'
import { addColors, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { ElasticsearchTransport } from 'winston-elasticsearch'
import { YYYYMMDDHHmmss } from './time'

export interface LogExtraMsg {
  message: string
  logLevel: string
}

const { label, colorize, timestamp, splat, json, prettyPrint, printf } = format

addColors({
  error: 'red bold',
  warn: 'yellow bold',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
})

export const winstonLoggerOptions: LoggerOptions = {
  format: format.combine(
    label({ label: 'Nest' }),
    colorize(),
    timestamp(),
    json(),
    colorize(),
    splat(),
    prettyPrint(),
    printf(({ level, message, timestamp, label }) => {
      return `[${label}] ${pid} - ${YYYYMMDDHHmmss(timestamp as string)} ${process.env.TZ ?? ''}     ${level} ${message}`
    }),
  ),

  handleExceptions: true,
  handleRejections: true,
  transports: [
    new transports.Console(),
    ...(process.env.NODE_ENV === 'prod'
      ? [new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          level: 'error',
          maxFiles: '14d',
        }), new DailyRotateFile({
          filename: 'logs/debug-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          level: 'debug',
          maxFiles: '14d',
        }), new ElasticsearchTransport({
          level: 'info',
          clientOpts: { node: 'http://localhost:9200', auth: { username: 'elastic', password: 'changeme' } },
          indexPrefix: 'nest-logs-info',
        }), new ElasticsearchTransport({
          level: 'error',
          clientOpts: { node: 'http://localhost:9200', auth: { username: 'elastic', password: 'changeme' } },
          indexPrefix: 'nest-logs-error',
        })]
      : []),
  ],
}
