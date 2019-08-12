import Airtable from 'airtable';
import myDatetime from './myDatetime';
import {
  AIRTABLE,
  TIME_ZONE
} from './../constants';
import * as loglevel from 'loglevel';

function getProfiles (subset = null) {
  const myPromise = new Promise((resolve, reject) => {
    const teers = {};

    loglevel.info(subset);

    let filter = {};
    if (subset) {
      const subsetString = subset.join(",");
      filter = {
        filterByFormula: `SEARCH({PersonID}, "${subsetString}")`,
      };
    }

    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.BASE_ID);
    base(AIRTABLE.PROFILES_TABLE).select({
      view: AIRTABLE.PROFILES_VIEW,
      ...filter,
    }).eachPage((records, fetchNextPage) => {
      records.forEach((record) => {
        teers[record.fields["PersonID"]] = record.fields;
      });
  
      fetchNextPage();
    }, (err) => {
      if (err) {
        loglevel.error(err);
      }
      loglevel.log("teers from getProfiles");
      loglevel.log(teers);
      resolve(teers);
    });
  })

  return myPromise;
}

function checkIn (personId, hours, carpoolSiteId) {
  const myPromise = new Promise((resolve, reject) => {
    var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.BASE_ID);

    base(AIRTABLE.ATTENDANCE_TABLE).create({
      "Volunteer ID": [
        personId
      ],
      "Carpool Site": [carpoolSiteId],
      "Hours": hours,
      "On Site": false,
      "Date": new Date(),
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

function getAttendanceRecordsToday (forCarpoolSite = null) {
  const myPromise = new Promise((resolve, reject) => {
    const nowInDetroit = myDatetime.getTimeInDetroit();
    // thanks to user113716 on SO for the clever way to add leading zeros without any comparisons
    // https://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
    const nowInDetroitStr = nowInDetroit.getFullYear() + "-" + ("0" + (nowInDetroit.getMonth() + 1)).slice(-2) + "-" + ("0" + nowInDetroit.getDate()).slice(-2);
    loglevel.debug(nowInDetroitStr);

    const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE_ID);

    const checkedInTeers = [];

    let myFilter = "";
    if (forCarpoolSite) {
      const siteFilter = "SEARCH('" + forCarpoolSite + "', ARRAYJOIN({Carpool Site}, ','))";
      myFilter = `AND(DATETIME_FORMAT(SET_TIMEZONE({Date}, '${AIRTABLE.TIME_ZONE}'), 'YYYY-MM-DD') = '${nowInDetroitStr}', ${siteFilter})`
    } else {
      myFilter = `DATETIME_FORMAT(SET_TIMEZONE({Date}, '${AIRTABLE.TIME_ZONE}'), 'YYYY-MM-DD') = '${nowInDetroitStr}'`;
    }

    base(AIRTABLE.ATTENDANCE_TABLE).select({
      view: AIRTABLE.ATTENDANCE_VIEW,
      // cellFormat: 'string',
      // userLocale: 'en-us',
      filterByFormula: myFilter,
      timeZone: AIRTABLE.TIME_ZONE,
    }).eachPage(function page(records, fetchNextPage) {
      records.forEach(record => checkedInTeers[record.get("Record ID")] = {
        "Volunteer ID": record.get("Volunteer ID"),
        "Carpool Site": record.get("Carpool Site"),
        "On Site": record.get("On Site"),
      });
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

function getProjectSites() {
  const myPromise = new Promise((resolve, reject) => {
    const projectSites = {};

    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.BASE_ID);

    base(AIRTABLE.PROJECT_SITES_TABLE).select({
      // Selecting the first 3 records in Grid view:
      view: AIRTABLE.PROJECT_SITES_VIEW,
    }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach(function (record) {
        projectSites[record.get('Record ID')] = record.fields;
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

    }, function done(err) {
      if (err) {
        console.error(err);
        return;
        reject(err);
      } else {
        resolve(projectSites);
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

    loglevel.info("carpoolSiteId: " + `${forCarpoolSite} hello ma'am`);

    base(AIRTABLE.HEADS_UP_TABLE).select({
      // Selecting the first 3 records in Grid view:
      view: AIRTABLE.HEADS_UP_VIEW,
      filterByFormula: `AND(DATETIME_FORMAT(SET_TIMEZONE({Date}, '${AIRTABLE.TIME_ZONE}'), 'YYYY-MM-DD') = '${nowInDetroitStr}', SEARCH("${forCarpoolSite}", ARRAYJOIN({Carpool Site}, ",")))`,
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

function setOnSiteStatus (attendanceRecId, isOnSite) {
  const myPromise = new Promise ((resolve, reject) => {

    const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE_ID);

    base(AIRTABLE.ATTENDANCE_TABLE).update(attendanceRecId, {
        "On Site": isOnSite
    }, function (err, record) {
      if (err) {
        loglevel.info(err);
        return;
      }
      loglevel.info(record.get('Volunteer ID'));
      resolve(record);
    })
  });
  return myPromise;
}

export default {
  getProfiles,
  checkIn,
  checkOut,
  getAttendanceRecordsToday,
  getCarpoolSites,
  getProjectSites,
  getHeadsUp,
  setOnSiteStatus,
};
