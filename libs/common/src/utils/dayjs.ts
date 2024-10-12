import * as dayjs from 'dayjs'

const YYYYMMDDHHmmss = (date: string | Date = new Date()) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')

export {
  dayjs,
  YYYYMMDDHHmmss,
}
