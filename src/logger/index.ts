import pino from 'pino'

import { config } from '../config.ts'

import type { LogContext } from './logger.type.ts'

const isDev = process.env.NODE_ENV !== 'production'

const base = pino({
  level: config.logLevel,
  serializers: {
    err: pino.stdSerializers.err,
  },
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          levelFirst: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
          messageFormat: '[ {module} ] {msg}',
        },
      }
    : undefined,
})


export const logger = {
  debug: (msg: string, ctx: LogContext) => base.debug(ctx, msg),
  info: (msg: string, ctx: LogContext) => base.info(ctx, msg),
  warn: (msg: string, ctx: LogContext) => base.warn(ctx, msg),
  error: (msg: string, ctx: LogContext) => base.error(ctx, msg),
}