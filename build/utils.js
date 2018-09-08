"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getActualDate;
// Function that generate the json file name with the actual date and return a string
// Format: 'month-day-year hours_minutes_milliseconds'
function getActualDate() {
  var dateTime = new Date();
  var formatDate = dateTime.getMonth() + 1 + "-" + dateTime.getDate() + "-" + dateTime.getFullYear() + " " + dateTime.getHours() + "_" + dateTime.getMinutes() + "_" + dateTime.getMilliseconds();
  return formatDate;
}