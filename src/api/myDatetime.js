import * as loglevel from 'loglevel';

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
  getDetroitUtcOffset
}
