import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, withRouter } from 'react-router-dom';
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
      tabVal: 0,
      tabIndex: 0,
      loadingTeerData: true,
    }

    this.checkInHandler = this.checkInHandler.bind(this);
    this.checkOutHandler = this.checkOutHandler.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
    this.setTabIndex = this.setTabIndex.bind(this);
  }

  // gets volunteer info from the Profiles table
  componentDidMount () {


    let self = this;

    const attendancePromise = sitcAirtable.getAttendanceRecordsToday();
    const headsUpPromise = attendancePromise
      .then(info => this.props.updateCheckedInTeers(info))
      .then(() => {return  sitcAirtable.getHeadsUp()})
      .then(info => this.props.updateHeadsUpTeers(info));

    headsUpPromise.then(() => {
      loglevel.info(this.props.headsUpTeers);
      const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE_ID);

      const volunteers = {};

      base(AIRTABLE.PROFILES_TABLE).select({
        maxRecords: 100,
        view: "Grid view"
      }).eachPage((records, fetchNextPage) => {
          records.forEach(function (record) {
            const personId = record.fields['PersonID'];
            volunteers[personId] = record.fields;
            if (!Object.values(self.props.checkedInTeers).includes(personId)) {
              self.props.notCheckedIn.push(personId);
            }
            // if (Object.keys(self.props.headsUpTeers).includes(personId)) {
            //   volunteers[personId]['isHeadsUp'] = true;
            //   volunteers[personId]['Primary Carpool'] = self.props.headsUpTeers[personId]['Carpool Site'][0];
            // }
          });

          fetchNextPage();
      }, (err) => {
          if (err) {
            loglevel.error(err);
          }
          this.props.updateVolunteerInfo(volunteers);
          this.setState({loadingTeerData: false})
        });
      });


  }

  checkInHandler (personId, hours) {
    sitcAirtable.checkIn(personId, hours).then(attendanceRecordId => {
      loglevel.info("Checked in!");
      const updatedCheckedInTeers = {...this.props.checkedInTeers};
      updatedCheckedInTeers[attendanceRecordId] = personId
      this.props.updateCheckedInTeers(updatedCheckedInTeers);
      loglevel.info(this.props.checkedInTeers);

      // have to slice because we need to assign a copy of the original, not a reference to it
      const updatedNotCheckedIn = this.props.notCheckedIn.slice();
      updatedNotCheckedIn.splice(updatedNotCheckedIn.indexOf(personId), 1);
      this.props.updateNotCheckedInTeers(updatedNotCheckedIn);
    }, err => loglevel.error("Error with the server call!"));
  }

  checkOutHandler (attendanceRecordId, personId) {
    loglevel.info('checking out ' + attendanceRecordId);
    sitcAirtable.checkOut(attendanceRecordId).then(deletedRecord => {
      loglevel.info("Deleted record " + deletedRecord);

      // Remove teer from checkedInTeers
      let updatedCheckedInTeers = { ...this.props.checkedInTeers };
      delete updatedCheckedInTeers[attendanceRecordId];
      this.props.updateCheckedInTeers(updatedCheckedInTeers)

      // Emplace teer in notCheckedInTeers
      this.props.updateNotCheckedInTeers(this.props.notCheckedIn.concat([personId]));
    })
  }

  handleTabChange (event, value) {
    this.props.clearFilter();
    this.props.setActiveTab(value);
    switch (value) {
      case 0:
        this.props.history.push('/');
        break;
      case 1:
        this.props.history.push('/checkedIn');
    }
  }

  setTabIndex (index) {
    this.setState({tabVal: index});
  }

  handleChangeIndex (index) {
    this.setState({tabVal: index});
  }

  render () {

    if (this.state.loadingTeerData) {
      return null;
    }

    return (
      <React.Fragment>
        <Tabs
          value={this.props.activeTab}
          onChange={this.handleTabChange}
          variant="fullWidth"
        >
          <Tab label="Registered" />
          <Tab label="Checked In" />
        </Tabs>
        {/* <SwipeableViews
          index={this.state.tabVal}
          onChangeIndex={this.handleChangeIndex}
        > */}
        <Switch>
          <Route exact path="/" render={routeProps => (
            <VolunteerList
              {...routeProps}
              checkInHandler={this.checkInHandler}
              volunteerInfo={this.props.volunteerInfo}
              checkedInTeers={this.props.checkedInTeers}
              notCheckedIn={this.props.notCheckedIn}
              headsUpTeers={this.props.headsUpTeers}
              carpoolSites={this.props.carpoolSites}
              filteredTeers={this.props.filteredTeers}
            />
          )} />
          <Route path="/checkedIn" render={routeProps => (
            <CheckedInList
              {...routeProps}
              checkOutHandler={this.checkOutHandler}
              volunteerInfo={this.props.volunteerInfo}
              checkedInTeers={this.props.checkedInTeers}
              setTabIndex={this.setTabIndex}
              filteredTeers={this.props.filteredTeers}
            />
          )}/>
        </Switch>


        {/* </SwipeableViews> */}
      </React.Fragment>
    );

  }
}

export default withRouter(MainView);
