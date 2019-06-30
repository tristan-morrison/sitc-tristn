import Airtable from 'airtable';
import myDatetime from './myDatetime';
import {
  AIRTABLE,
  TIME_ZONE
} from './../constants';
import * as loglevel from 'loglevel';

function checkIn (personId, hours) {
  const myPromise = new Promise((resolve, reject) => {
    var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.BASE_ID);

    base(AIRTABLE.ATTENDANCE_TABLE).create({
      "Volunteer ID": [
        personId
      ],
      "Hours": hours,
      "On Site": false
    }, function(err, record) {
      if (err) {
        loglevel.error(err)
        reject(err);
      } else {
        loglevel.info(record.getId());
        resolve(record.getId());
      }
    })
  });

  return myPromise;
}

function checkOut (attendanceRecordId) {
  const myPromise = new Promise((resolve, reject) => {
    const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE_ID);

    base(AIRTABLE.ATTENDANCE_TABLE).destroy(attendanceRecordId, (err, deletedRecord) => {
      if (err) {
        loglevel.info('Failed to delete record ' + deletedRecord);
        reject();
      } else {
        resolve(deletedRecord);
      }
    })
  });

  return myPromise;
}

function getAttendanceRecordsToday () {
  const myPromise = new Promise((resolve, reject) => {
    const nowInDetroit = myDatetime.getTimeInDetroit();
    // thanks to user113716 on SO for the clever way to add leading zeros without any comparisons
    // https://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
    const nowInDetroitStr = nowInDetroit.getFullYear() + "-" + ("0" + (nowInDetroit.getMonth() + 1)).slice(-2) + "-" + ("0" + nowInDetroit.getDate()).slice(-2);
    loglevel.debug(nowInDetroitStr);

    const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE_ID);

    const checkedInTeers = [];

    // TODO: figure out timezone matching

    base(AIRTABLE.ATTENDANCE_TABLE).select({
      view: AIRTABLE.ATTENDANCE_VIEW,
      // cellFormat: 'string',
      // userLocale: 'en-us',
      filterByFormula: `DATETIME_FORMAT(SET_TIMEZONE({Date}, '${AIRTABLE.TIME_ZONE}'), 'YYYY-MM-DD') = '${nowInDetroitStr}'`,
      timeZone: AIRTABLE.TIME_ZONE,
    }).eachPage(function page(records, fetchNextPage) {
      records.forEach(record => checkedInTeers[record.get("Record ID")] = record.get("Volunteer ID")[0]);
      fetchNextPage();
    }, function done(err) {
      if (err) {
        loglevel.error(err);
      }
      resolve(checkedInTeers);
    });
  });

  return myPromise;
}

function getCarpoolSites () {
  const myPromise = new Promise((resolve, reject) => {
    const carpoolSites = {};

    const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE_ID);

    base(AIRTABLE.CARPOOL_SITES_TABLE).select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 50,
      view: AIRTABLE.CARPOOL_SITES_VIEW,
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

      records.forEach(function(record) {
        carpoolSites[record.get('Record ID')] = record.fields;
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

      }, function done(err) {
          if (err) {
            console.error(err); return;
            reject(err);
          } else {
            resolve(carpoolSites);
          }
       });
    });

    return myPromise;
}

function getHeadsUp (forCarpoolSite) {
  const myPromise = new Promise ((resolve, reject) => {
    const headsUpTeers = {};

    const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE_ID);

    const nowInDetroit = myDatetime.getTimeInDetroit();
    // thanks to user113716 on SO for the clever way to add leading zeros without any comparisons
    // https://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
    const nowInDetroitStr = nowInDetroit.getFullYear() + "-" + ("0" + (nowInDetroit.getMonth() + 1)).slice(-2) + "-" + ("0" + nowInDetroit.getDate()).slice(-2);

    base(AIRTABLE.HEADS_UP_TABLE).select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 50,
      view: AIRTABLE.HEADS_UP_VIEW,
      filterByFormula: `DATETIME_FORMAT(SET_TIMEZONE({Date}, '${AIRTABLE.TIME_ZONE}'), 'YYYY-MM-DD') = '${nowInDetroitStr}'`, // AND(DATETIME_FORMAT(SET_TIMEZONE({Date}, '${AIRTABLE.TIME_ZONE}'), 'YYYY-MM-DD') = '${nowInDetroitStr}', {Carpool Site} = '${forCarpoolSite}')
    }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach(function(record) {
        headsUpTeers[record.get('Volunteer ID')] = record.fields;
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

    }, function done(err) {
      if (err) {
        console.error(err);
        reject();
      } else {
        resolve(headsUpTeers);
      }
    });
  });
  return myPromise;
}

export default {
  checkIn,
  checkOut,
  getAttendanceRecordsToday,
  getCarpoolSites,
  getHeadsUp,
};
