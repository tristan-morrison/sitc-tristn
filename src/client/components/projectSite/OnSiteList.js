import React from 'react';
import Airtable from 'airtable';
import * as loglevel from 'loglevel';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import OnSiteListRow from './OnSiteListRow';

const styles = theme => ({
});

class OnSiteList extends React.Component {

  constructor () {
    super();

    this.state = {
      hide: []
    }

    this.setNotOnSite = this.setNotOnSite.bind(this);
  }

  componentDidMount () {
    this.props.setTabIndex(1);
  }

  setNotOnSite (personId) {
    const hideArr = this.state.hide.slice();
    this.setState({ hide: hideArr.concat(personId) });
    this.props.setNotOnSiteHandler(personId);
  }

  render () {
    const listToRender = (this.props.filteredTeers.length > 0) ? this.props.filteredTeers : Object.keys(this.props.onSiteTeers);

    const teerListItems = [];
    listToRender.forEach(attendanceRecId => {
      const personId = this.props.onSiteTeers[attendanceRecId].personId;
      teerListItems.push(
        <OnSiteListRow
          key = {personId}
          personId = {personId}
          attendanceRecordId = {attendanceRecId}
          firstName = {this.props.volunteerInfo[personId]['First Name']}
          lastName = {this.props.volunteerInfo[personId]['Last Name']}
          hours = {this.props.volunteerInfo[personId]['Hours Credited']}
          setNotOnSite = {this.setNotOnSite}
          hide={this.state.hide.includes(personId)}
        />
      );
    });

    return (
      <List>
        {teerListItems}
      </List>
    );
  }

}

export default withStyles(styles)(OnSiteList);
