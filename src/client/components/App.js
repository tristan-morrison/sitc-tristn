import React from 'React';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router-dom';
import Airtable from 'airtable';
import loglevel from 'loglevel';

import { withStyles } from '@material-ui/core/styles';

import TristnAppBar from './TristnAppBar';
import MainView from './MainView'
import SiteSelect from './SiteSelect';
import sitcAirtable from './../api/sitcAirtable';

const styles = theme => ({
  root: {
    width: '100%'
  }
});

class App extends React.Component {
  constructor () {
    super();

    this.state = {
      volunteerInfo: {},
      filteredVolunteerIds: [],
      checkedInTeers: {},
      notCheckedInTeers: [],
      carpoolSites: {},
      defaultCarpoolSiteId: '',
      headsUpTeers: {},
    }

    this.updateVolunteerInfo = this.updateVolunteerInfo.bind(this);
    this.updateCheckedInTeers = this.updateCheckedInTeers.bind(this);
    this.updateNotCheckedInTeers = this.updateNotCheckedInTeers.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.updateDefaultCarpoolSite = this.updateDefaultCarpoolSite.bind(this);
    this.updateHeadsUpTeers = this.updateHeadsUpTeers.bind(this);
  }

  componentDidMount () {

    const carpoolSitesPromise = sitcAirtable.getCarpoolSites();
    carpoolSitesPromise.then(siteInfo => {
      loglevel.info(siteInfo);
      this.setState({carpoolSites: siteInfo});
    })

  }

  updateCarpoolSites (sites) {
    this.setState({carpoolSites: sites});
  }

  updateDefaultCarpoolSite (siteId) {
    this.setState({defaultCarpoolSiteId: siteId});
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

  setFilter (filteredTeers) {
    loglevel.debug(filteredTeers);
    this.setState({filteredVolunteerIds: filteredTeers});
  }

  render () {
    const { classes } = this.props;

    return (
      <div id="Root" className={classes.root}>
        <React.Fragment key="1">
          <TristnAppBar
            setFilter={this.setFilter}
            volunteerInfo={this.state.volunteerInfo}
          />
          <MainView
            updateVolunteerInfo={this.updateVolunteerInfo}
            updateCheckedInTeers={this.updateCheckedInTeers}
            updateNotCheckedInTeers={this.updateNotCheckedInTeers}
            updateHeadsUpTeers={this.updateHeadsUpTeers}
            volunteerInfo={this.state.volunteerInfo}
            filteredVolunteerIds={this.state.filteredVolunteerIds}
            checkedInTeers={this.state.checkedInTeers}
            notCheckedIn={this.state.notCheckedInTeers}
            headsUpTeers={this.state.headsUpTeers}
            carpoolSites={this.state.carpoolSites}
          />
        </React.Fragment>
      </div>
    )
  }

}

export default withStyles(styles)(App);
