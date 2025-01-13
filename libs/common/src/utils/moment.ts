import { format } from 'date-fns'

const YYYYMMDDHHmmss = (date: string | Date = new Date()) => format(date, 'yyyy-MM-dd HH:mm:ss:SSS')

export {
  YYYYMMDDHHmmss,
}
