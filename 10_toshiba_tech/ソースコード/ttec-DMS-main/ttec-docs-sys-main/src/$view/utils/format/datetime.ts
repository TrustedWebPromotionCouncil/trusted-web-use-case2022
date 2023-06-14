import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export const utcDateToLocalDate = (utc: string): string => {
    const utcDate = new Date(utc)
    const jstDate = utcToZonedTime(utcDate, 'Asia/Tokyo')

    return format(jstDate, 'yyyy年MM月dd日 HH:mm:ss')
}