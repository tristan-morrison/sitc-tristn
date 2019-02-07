import * as loglevel from 'loglevel';

import { TIME } from './../constants';

function getTimeInDetroit () {
  // get local time
  const myDate = new Date();
  // set time to UTC
  myDate.setTime(myDate.getTime() + (myDate.getTimezoneOffset() * TIME.MILLISECS_IN_MIN));
  // set time to Detroit time
  myDate.setTime(myDate.getTime() - (getDetroitUtcOffsetInHours(myDate) * TIME.MILLISECS_IN_HOUR));
  return myDate;
}

function convertDetroitToUTC (dateToConvert) {
  const myDateToConvert = new Date(dateToConvert.getTime());
  myDateToConvert.setTime(myDateToConvert.getTime() + (getDetroitUtcOffsetInHours(myDateToConvert) * TIME.MILLISECS_IN_HOUR));
  return myDateToConvert;
}

function getDetroitUtcOffsetInHours (onDate) {
  const dateInJan = new Date();
  dateInJan.setMonth(0);
  const dateInJune = new Date();
  dateInJune.setMonth(5);
  // if dst is not in effect, offset in Detroit is -5 hours
  // if dst is in effect, offset in Detroit is -4 hours
  if (onDate.getTimezoneOffset() < dateInJan.getTimezoneOffset() || onDate.getTimezoneOffset() < dateInJune.getTimezoneOffset()) {
    return 4;
  } else {
    return 5;
  }
}

export default {
  getTimeInDetroit,
  convertDetroitToUTC,
  getDetroitUtcOffsetInHours
}
