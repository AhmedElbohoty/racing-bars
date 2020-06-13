import { Data } from './data';
import { zeroPad } from './utils';

export const getDates = (data: Data[]) => Array.from(new Set(data.map((d) => d.date))).sort();

export function getDateString(inputDate: string | Date) {
  const date = new Date(inputDate);
  if (isNaN(+date)) {
    throw new Error(`"${inputDate}" is not a valid date`);
  }

  const year = date.getFullYear().toString();
  const month = zeroPad((1 + date.getMonth()).toString(), 2);
  const day = zeroPad(date.getDate().toString(), 2);

  return `${year}-${month}-${day}`;
}

export function formatDate(dateStr: string, format = 'YYYY-MM-DD') {
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(5, 7);
  const day = dateStr.slice(7, 9);
  const date = new Date(dateStr);
  const weekDayIndex = String(date.getDay());
  const monthNames: { [key: string]: string } = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
  };

  const weekDays: { [key: string]: string } = {
    '0': 'Sun',
    '1': 'Mon',
    '2': 'Tue',
    '3': 'Wed',
    '4': 'Thu',
    '5': 'Fri',
    '6': 'Sat',
  };

  return format
    .replace('MMM', monthNames[month])
    .replace('DDD', weekDays[weekDayIndex])
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
}
