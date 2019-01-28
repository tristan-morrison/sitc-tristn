import React from 'React';
import ReactDOM from 'react-dom';
import Airtable from 'airtable';
import loglevel from 'loglevel';

import { withStyles } from '@material-ui/core/styles';

import VolunteerList from './VolunteerList';
import TristnAppBar from './TristnAppBar';

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
    }

    this.updateVolunteerInfo = this.updateVolunteerInfo.bind(this);
    this.updateCheckedInTeers = this.updateCheckedInTeers.bind(this);
    this.setFilter = this.setFilter.bind(this);
  }

  updateVolunteerInfo (info) {
    this.setState({volunteerInfo: info});
  }

  updateCheckedInTeers (info) {
    this.setState({checkedInTeers: info})
    loglevel.info(info);
  }

  setFilter (filteredTeers) {
    loglevel.debug(filteredTeers);
    this.setState({filteredVolunteerIds: filteredTeers});
  }

  render () {
    const { classes } = this.props;

    return (
      <div id="Root" className={classes.root}>
        <TristnAppBar
            setFilter={this.setFilter}
            volunteerInfo={this.state.volunteerInfo}
        />
        <VolunteerList
          updateVolunteerInfo={this.updateVolunteerInfo}
          updateCheckedInTeers={this.updateCheckedInTeers}
          volunteerInfo={this.state.volunteerInfo}
          filteredVolunteerIds={this.state.filteredVolunteerIds}
          checkedInTeers={this.state.checkedInTeers}
        />
      </div>
    )
  }

}

export default withStyles(styles)(App);
