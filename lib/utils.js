// Function that generate the json file name with the actual date and return a string
// Format: 'month-day-year hours_minutes_milliseconds'
export default function getActualDate() {
  const dateTime = new Date();
  const formatDate = `${dateTime.getMonth() + 1}-${dateTime.getDate()}-${dateTime.getFullYear()} ${dateTime.getHours()}_${dateTime.getMinutes()}_${dateTime.getMilliseconds()}`;
  return formatDate;
}
