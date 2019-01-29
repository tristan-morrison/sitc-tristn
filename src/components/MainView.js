import React from 'React';
import ReactDOM from 'react-dom';
import Airtable from 'airtable';
import * as loglevel from 'loglevel';
import {AIRTABLE} from './../constants';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';



import VolunteerList from './VolunteerList';
import CheckedInList from './CheckedInList';
import sitcAirtable from './../api/sitcAirtable';

class MainView extends React.Component {

  constructor () {
    super();

    this.state = {
      notCheckedIn: [],
    }

    this.checkInHandler = this.checkInHandler.bind(this);
  }

  // gets volunteer info from the Profiles table
  componentDidMount () {
    let self = this;

    const attendancePromise = sitcAirtable.getAttendanceRecordsToday();
    const updatePromise = attendancePromise.then(info => this.props.updateCheckedInTeers(info));

    updatePromise.then(() => {
      const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE_ID);

      const volunteers = {};

      base(AIRTABLE.PROFILES_TABLE).select({
        maxRecords: 100,
        view: "Grid view"
      }).eachPage((records, fetchNextPage) => {
          records.forEach(function (record) {
            loglevel.debug(record.fields['PersonID']);
            volunteers[record.fields['PersonID']] = record.fields;
            if (!self.props.checkedInTeers.includes(record.fields['PersonID'])) {
              self.state.notCheckedIn.push(record.fields['PersonID']);
            }
          });

          fetchNextPage();
      }, (err) => {
          if (err) {
            loglevel.error(err);
          }
          this.props.updateVolunteerInfo(volunteers);
        });
      });


  }

  checkInHandler (personId, hours) {
    sitcAirtable.checkIn(personId, hours).then(code => {
      loglevel.info("Checked in!");
      this.props.updateCheckedInTeers(this.props.checkedInTeers.concat([personId]))
      loglevel.info(this.props.checkedInTeers);

      // have to slice because we need to assign a copy of the original, not a reference to it
      const updatedNotCheckedIn = this.state.notCheckedIn.slice();
      updatedNotCheckedIn.splice(updatedNotCheckedIn.indexOf(personId), 1);
      this.setState({notCheckedIn: updatedNotCheckedIn});
    }, err => loglevel.error("Error with the server call!"));
  }

  render () {
    const listToRender = (this.props.filteredVolunteerIds.length > 0) ? this.props.filteredVolunteerIds : Object.keys(this.props.volunteerInfo);

    return (
      <VolunteerList
        checkInHandler={this.checkInHandler}
        volunteerInfo={this.props.volunteerInfo}
        checkedInTeers={this.props.checkedInTeers}
        listToRender={this.state.notCheckedIn}
      />
    );

  }
}

export default MainView;
