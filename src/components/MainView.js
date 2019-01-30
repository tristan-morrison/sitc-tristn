import React from 'React';
import ReactDOM from 'react-dom';
import SwipeableViews from 'react-swipeable-views';
import Airtable from 'airtable';
import * as loglevel from 'loglevel';
import {AIRTABLE} from './../constants';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import VolunteerList from './VolunteerList';
import CheckedInList from './CheckedInList';
import sitcAirtable from './../api/sitcAirtable';

class MainView extends React.Component {

  constructor () {
    super();

    this.state = {
      notCheckedIn: [],
      tabVal: 0,
      tabIndex: 0,
    }

    this.checkInHandler = this.checkInHandler.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
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

  handleTabChange (event, value) {
    this.setState({tabVal: value});
  }

  handleChangeIndex (index) {
    this.setState({tabVal: index});
  }

  render () {
    const listToRender = (this.props.filteredVolunteerIds.length > 0) ? this.props.filteredVolunteerIds : Object.keys(this.props.volunteerInfo);

    return (
      <React.Fragment>
        <Tabs
          value={this.state.tabVal}
          onChange={this.handleTabChange}
          variant="fullWidth"
        >
          <Tab label="Registered" />
          <Tab label="Checked In" />
        </Tabs>
        <SwipeableViews
          index={this.state.tabVal}
          onChangeIndex={this.handleChangeIndex}
        >
          <VolunteerList
            checkInHandler={this.checkInHandler}
            volunteerInfo={this.props.volunteerInfo}
            checkedInTeers={this.props.checkedInTeers}
            listToRender={this.state.notCheckedIn}
          />
          <CheckedInList />
        </SwipeableViews>
      </React.Fragment>
    );

  }
}

export default MainView;
