import { dayjs } from 'element-plus'

export const timeFormat = (time) => dayjs(time).format('YYYY年MM月DD日 HH:mm:ss')
