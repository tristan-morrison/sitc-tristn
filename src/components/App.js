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
      filteredVolunteerIds: []
    }

    this.updateVolunteerInfo = this.updateVolunteerInfo.bind(this);
    this.setFilter = this.setFilter.bind(this);
  }

  updateVolunteerInfo (info) {
    this.setState({volunteerInfo: info});
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
          volunteerInfo={this.state.volunteerInfo}
          filteredVolunteerIds={this.state.filteredVolunteerIds}
        />
      </div>
    )
  }

}

export default withStyles(styles)(App);
