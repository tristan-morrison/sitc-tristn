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
            if (!self.props.checkedInTeers.includes(personId)) {
              self.props.notCheckedIn.push(personId);
            }
            if (Object.keys(self.props.headsUpTeers).includes(personId)) {
              volunteers[personId]['isHeadsUp'] = true;
              volunteers[personId]['Primary Carpool'] = self.props.headsUpTeers[personId]['Carpool Site'][0];
            }
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
    sitcAirtable.checkIn(personId, hours).then(code => {
      loglevel.info("Checked in!");
      this.props.updateCheckedInTeers(this.props.checkedInTeers.concat([personId]))
      loglevel.info(this.props.checkedInTeers);

      // have to slice because we need to assign a copy of the original, not a reference to it
      const updatedNotCheckedIn = this.props.notCheckedIn.slice();
      updatedNotCheckedIn.splice(updatedNotCheckedIn.indexOf(personId), 1);
      this.props.updateNotCheckedInTeers(updatedNotCheckedIn);
    }, err => loglevel.error("Error with the server call!"));
  }

  handleTabChange (event, value) {
    this.setState({tabVal: value});
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
    const listToRender = (this.props.filteredVolunteerIds.length > 0) ? this.props.filteredVolunteerIds : this.props.notCheckedIn;

    if (this.state.loadingTeerData) {
      return null;
    }

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
              listToRender={listToRender}
              headsUpTeers={this.props.headsUpTeers}
              carpoolSites={this.props.carpoolSites}
            />
          )} />
          <Route path="/checkedIn" render={routeProps => (
            <CheckedInList
              {...routeProps}
              volunteerInfo={this.props.volunteerInfo}
              listToRender={this.props.checkedInTeers}
              setTabIndex={this.setTabIndex}
            />
          )}/>
        </Switch>


        {/* </SwipeableViews> */}
      </React.Fragment>
    );

  }
}

export default withRouter(MainView);
