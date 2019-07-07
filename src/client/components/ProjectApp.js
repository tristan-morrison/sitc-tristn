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
      checkedInTeers: {},
      notCheckedInTeers: [],
      projectSites: {},
      projectSiteId: {},
      defaultProjectSiteId: '',
      headsUpTeers: {},
      activeTab: 0
    }

    this.updateVolunteerInfo = this.updateVolunteerInfo.bind(this);
    this.updateCheckedInTeers = this.updateCheckedInTeers.bind(this);
    this.updateNotCheckedInTeers = this.updateNotCheckedInTeers.bind(this);
    this.updateProjectSites = this.updateProjectSites.bind(this);
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

  updateDefaultProjectSite (siteId) {
    this.setState({defaultProjectSiteId: siteId});
  }

  updateVolunteerInfo (info) {
    this.setState({volunteerInfo: info});
  }

  updateCheckedInTeers (info) {
    this.setState({checkedInTeers: info})
    loglevel.info(info);
  }

  updateNotCheckedInTeers (info) {
    this.setState({notCheckedInTeers: info});
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
            checkedInTeers={this.state.checkedInTeers}
            notCheckedInTeers={this.state.notCheckedInTeers}
            activeTab={this.state.activeTab}
            searchText={this.state.searchText}
          />
          <MainView
            updateVolunteerInfo={this.updateVolunteerInfo}
            updateCheckedInTeers={this.updateCheckedInTeers}
            updateNotCheckedInTeers={this.updateNotCheckedInTeers}
            updateHeadsUpTeers={this.updateHeadsUpTeers}
            volunteerInfo={this.state.volunteerInfo}
            filteredTeers={this.state.filteredTeers}
            checkedInTeers={this.state.checkedInTeers}
            notCheckedIn={this.state.notCheckedInTeers}
            headsUpTeers={this.state.headsUpTeers}
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
