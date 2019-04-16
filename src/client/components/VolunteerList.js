import React from 'React';
import ReactDOM from 'react-dom';
import Airtable from 'airtable';
import * as loglevel from 'loglevel';
import {AIRTABLE} from './../constants';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';


import VolunteerListRow from './VolunteerListRow';
import CheckInDialog from './CheckInDialog';
import sitcAirtable from './../api/sitcAirtable';

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

    this.checkIn = this.checkIn.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.checkInDialog = this.checkInDialog.bind(this);
  }

  checkIn (personId, hours) {

    const hideArr = this.state.hide.slice();
    this.setState({ hide: hideArr.concat(personId)});


    if (Object.values(this.props.checkedInTeers).includes(personId)) {
      loglevel.error("This person is already checked in!!");
      return -1;
    }
    this.props.checkInHandler(personId, hours)
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

    const listToRender = (this.props.filteredTeers.length > 0) ? this.props.filteredTeers : this.props.notCheckedIn

    listToRender.forEach((personID) => {
      teerListItems.push(
        <VolunteerListRow
          personId = {personID}
          firstName = {this.props.volunteerInfo[personID]['First Name']}
          lastName = {this.props.volunteerInfo[personID]['Last Name']}
          paid = {this.props.volunteerInfo[personID]['Paid']}
          hours = {this.props.volunteerInfo[personID]['Hours Credited']}
          hasCar = {this.props.volunteerInfo[personID]['Has Car']}
          primaryCarpoolSite = {this.props.volunteerInfo[personID]['Primary Carpool']}
          carpoolSites = {this.props.carpoolSites}
          checkIn = {this.checkIn}
          checkInDialog = {this.checkInDialog}
          hide={hide.includes(personID)}
        />
      );
    });

    return (
      <React.Fragment>
        <List>
          {teerListItems}
        </List>
        {this.state.dialog}
      </React.Fragment>
    );
  }


}

export default withStyles(styles)(VolunteerList);
