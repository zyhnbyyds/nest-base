import { DateTime } from 'luxon'

const timeZone = process.env.TZ

function YYYYMMDDHHmmss(date: string) {
  return DateTime.fromISO(date).setZone(timeZone).toFormat('yyyy-MM-dd HH:mm:ss')
}

export {
  YYYYMMDDHHmmss,
}
