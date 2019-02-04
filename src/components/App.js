import React from 'React';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router-dom';
import Airtable from 'airtable';
import loglevel from 'loglevel';

import { withStyles } from '@material-ui/core/styles';

import TristnAppBar from './TristnAppBar';
import MainView from './MainView'
import Auth from './../api/Auth';

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
      checkedInTeers: [],
      notCheckedInTeers: [],
      auth: new Auth(),
      carpoolSites: {},
      defaultCarpoolSiteId: '',
    }

    this.updateVolunteerInfo = this.updateVolunteerInfo.bind(this);
    this.updateCheckedInTeers = this.updateCheckedInTeers.bind(this);
    this.updateNotCheckedInTeers = this.updateNotCheckedInTeers.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
  }

  componentDidMount () {
    const myAuth = new Auth();
    this.setState({ auth: myAuth});

    
  }

  updateCarpoolSites (sites) {
    this.setState({carpoolSites: sites});
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

  setFilter (filteredTeers) {
    loglevel.debug(filteredTeers);
    this.setState({filteredVolunteerIds: filteredTeers});
  }

  handleAuthentication () {
    this.state.auth.handleAuthentication();
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
          <Switch>
            <Route exact path="/" render={routeProps => (
              <MainView
                {...routeProps}
                auth = {this.state.auth}
                updateVolunteerInfo={this.updateVolunteerInfo}
                updateCheckedInTeers={this.updateCheckedInTeers}
                updateNotCheckedInTeers={this.updateNotCheckedInTeers}
                volunteerInfo={this.state.volunteerInfo}
                filteredVolunteerIds={this.state.filteredVolunteerIds}
                checkedInTeers={this.state.checkedInTeers}
                notCheckedIn={this.state.notCheckedInTeers}
              />
            )} />
            <Route path="/siteSelect" render={routeProps => {
              this.handleAuthentication();
              return (
                <h2>Hello, authenticated user!</h2>
              );
            }} />
          </Switch>
        </React.Fragment>
      </div>
    )
  }

}

export default withStyles(styles)(App);
