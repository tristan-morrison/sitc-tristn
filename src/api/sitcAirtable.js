import Airtable from 'airtable';
import * as loglevel from 'loglevel';

function checkIn (personId, hours) {
  var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.VOLUNTEERS_BASE_ID);

  loglevel.info(personId);

  base('Attendance').create({
    "Volunteer ID": [
      personId
    ],
    "Hours": hours,
    "On Site": false
  }, function(err, record) {
    if (err) {
      loglevel.error(err)
      return -1;
    } else {
      loglevel.info(record.getId());
      return 0;
    }
  })
}

export default {
  checkIn
};
