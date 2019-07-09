import React from 'react';
import ReactDOM from 'react-dom';
import Airtable from 'airtable';
import * as loglevel from 'loglevel';
import {AIRTABLE} from './../../constants';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';


import VolunteerListRow from './VolunteerListRow';
import sitcAirtable from './../../api/sitcAirtable';

const styles = theme => ({
  avatar: {
    backgroundColor: theme.palette.primary[500],
  }
});

class VolunteerList extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      hide: [],
      dialog: null,
    }

    this.setOnSite = this.setOnSite.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.checkInDialog = this.checkInDialog.bind(this);
    }

  setOnSite(personId) {
    const onSiteIds = Object.values(this.props.onSiteTeers).map((teerInfo) => teerInfo.personId[0]);

    if (onSiteIds.includes(personId)) {
      loglevel.error("This person is already checked in!!");
      return -1;
    }

    const hideArr = this.state.hide.slice();
    this.setState({
      hide: hideArr.concat(personId)
    });

    this.props.setOnSiteHandler(personId)
  }

  checkInDialog (personId) {
    const myPromise = new Promise((resolve, reject) => {
      const dialog = (
        <CheckInDialog
          resolve={resolve}
          closeDialog={this.closeDialog}
          personId = {personId}
          personInfo = {this.props.volunteerInfo[personId]}
        />
      );
      this.setState({dialog: dialog});
    });
    return myPromise
  }

  closeDialog() {
    loglevel.info("closeDialog was run");
    this.setState({dialog: null});
  }

  render() {
    const { classes } = this.props;
    const hide = this.state.hide;
    const teerListItems = [];

    const listToRender = (this.props.filteredTeers.length > 0) ? this.props.filteredTeers : Object.values(this.props.notOnSiteTeers).map((notOnSiteRec) => notOnSiteRec.personId[0]);

    listToRender.forEach((personID) => {
      teerListItems.push(
        <VolunteerListRow
          key = {personID}
          personId = {personID}
          firstName = {this.props.volunteerInfo[personID]['First Name']}
          lastName = {this.props.volunteerInfo[personID]['Last Name']}
          hours = {this.props.volunteerInfo[personID]['Hours Credited']}
          carpoolSite = {this.props.volunteerInfo[personID].checkedInAtCarpoolSite}
          carpoolSites = {this.props.carpoolSites}
          setOnSite = {this.setOnSite}
          checkInDialog = {this.checkInDialog}
          hide={hide.includes(personID)}
        />
      );
    });

    return (
      <React.Fragment>
        {
          (teerListItems.length < 1) && 
            <Typography variant="h6">No volunteers checked in yet.</Typography>
        }
        <List>
          {teerListItems}
        </List>
        {this.state.dialog}
      </React.Fragment>
    );
  }


}

export default withStyles(styles)(VolunteerList);
