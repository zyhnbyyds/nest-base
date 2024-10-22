import moment from 'moment'

const YYYYMMDDHHmmss = (date: string | Date = new Date()) => moment(date).format('YYYY-MM-DD HH:mm:ss')

export {
  YYYYMMDDHHmmss,
}
