import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router-dom';
import Airtable from 'airtable';
import loglevel from 'loglevel';

import { withStyles } from '@material-ui/core/styles';

import TristnAppBar from './TristnAppBar';
import MainView from './projectSite/MainView';
import sitcAirtable from './../api/sitcAirtable';

const styles = theme => ({
  root: {
    width: '100%'
  }
});

class ProjectApp extends React.Component {
  constructor () {
    super();

    this.state = {
      volunteerInfo: {},
      filteredTeers: [],
      searchText: '',
      attendanceRecs: {},
      onSiteTeers: {},
      notOnSiteTeers: {},
      carpoolSites: {},
      projectSites: {},
      projectSiteId: {},
      defaultProjectSiteId: '',
      headsUpTeers: {},
      activeTab: 0
    }

    this.updateVolunteerInfo = this.updateVolunteerInfo.bind(this);
    this.updateOnSiteTeers = this.updateOnSiteTeers.bind(this);
    this.updateNotOnSiteTeers = this.updateNotOnSiteTeers.bind(this);
    this.updateProjectSites = this.updateProjectSites.bind(this);
    this.updateCarpoolSites = this.updateCarpoolSites.bind(this);
    this.updateAttendanceRecs = this.updateAttendanceRecs.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.setSearchText = this.setSearchText.bind(this);
    this.setActiveTab = this.setActiveTab.bind(this);
    this.updateDefaultProjectSite = this.updateDefaultProjectSite.bind(this);
    this.updateHeadsUpTeers = this.updateHeadsUpTeers.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.setProjectSiteId = this.setProjectSiteId.bind(this);
    this.setProjectSiteId = this.setProjectSiteId.bind(this);
  }

  updateProjectSites (sites) {
    this.setState({projectSites: sites});
  }

  updateCarpoolSites (sites) {
    this.setState({carpoolSites: sites});
  }

  updateDefaultProjectSite (siteId) {
    this.setState({defaultProjectSiteId: siteId});
  }

  updateVolunteerInfo (info) {
    this.setState({volunteerInfo: info});
  }

  updateAttendanceRecs (info) {
    this.setState({attendanceRecs: info});
  }

  updateOnSiteTeers (info) {
    this.setState({onSiteTeers: info})
    loglevel.info(info);
  }

  updateNotOnSiteTeers (info) {
    this.setState({notOnSiteTeers: info});
    loglevel.info(info);
  }

  updateHeadsUpTeers (info) {
    this.setState({headsUpTeers: info});
  }

  setSearchText (updatedSearchText) {
    this.setState({searchText: updatedSearchText});
  }

  setFilter (filteredTeers) {
    loglevel.debug(filteredTeers);
    this.setState({filteredTeers: filteredTeers});
  }

  clearFilter () {
    this.setState({filteredTeers: []});
  }

  setActiveTab (tabIndex) {
    this.setState({activeTab: tabIndex, searchText: ''});
  }

  setProjectSiteId (siteId) {
    this.setState({projectSiteId: siteId});
  }

  render () {
    const { classes } = this.props;

    return (
      <div id="Root" className={classes.root}>
        <React.Fragment key="1">
          <TristnAppBar
            setFilter={this.setFilter}
            setSearchText={this.setSearchText}
            volunteerInfo={this.state.volunteerInfo}
            checkedInTeers={this.state.onSiteTeers}
            notCheckedInTeers={Object.values(this.state.notOnSiteTeers).map((record) => record.personId)}
            activeTab={this.state.activeTab}
            searchText={this.state.searchText}
          />
          <MainView
            updateVolunteerInfo={this.updateVolunteerInfo}
            updateOnSiteTeers={this.updateOnSiteTeers}
            updateNotOnSiteTeers={this.updateNotOnSiteTeers}
            updateProjectSites={this.updateProjectSites}
            updateCarpoolSites={this.updateCarpoolSites}
            updateAttendanceRecs={this.updateAttendanceRecs}
            updateHeadsUpTeers={this.updateHeadsUpTeers}
            volunteerInfo={this.state.volunteerInfo}
            filteredTeers={this.state.filteredTeers}
            attendanceRecs={this.state.attendanceRecs}
            onSiteTeers={this.state.onSiteTeers}
            notOnSiteTeers={this.state.notOnSiteTeers}
            headsUpTeers={this.state.headsUpTeers}
            carpoolSites={this.state.carpoolSites}
            projectSites={this.state.projectSites}
            projectSiteId={this.state.projectSiteId}
            setProjectSiteId={this.setProjectSiteId}
            activeTab={this.state.activeTab}
            setActiveTab={this.setActiveTab}
            clearFilter={this.clearFilter}
          />
        </React.Fragment>
      </div>
    )
  }

}

export default withStyles(styles)(ProjectApp);
