import React from 'React';
import ReactDOM from 'react-dom';
import Airtable from 'airtable';
import * as loglevel from 'loglevel';
import {AIRTABLE} from './../constants';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';


import VolunteerListRow from './VolunteerListRow';
import sitcAirtable from './../api/sitcAirtable';

const styles = theme => ({
  avatar: {
    backgroundColor: theme.palette.primary[500]
  }
});

class VolunteerList extends React.Component {
  constructor (props) {
    super(props);

    this.checkIn = this.checkIn.bind(this);
  }

  checkIn (personId, hours) {
    if (this.props.checkedInTeers.includes(personId)) {
      loglevel.error("This person is already checked in!!");
      return -1;
    }
    this.props.checkInHandler(personId, hours)
  }

  render() {
    const { classes } = this.props;
    const teerListItems = [];
    this.props.listToRender.forEach((personID) => {
      teerListItems.push(
        <VolunteerListRow
          personId = {personID}
          firstName = {this.props.volunteerInfo[personID]['First Name']}
          lastName = {this.props.volunteerInfo[personID]['Last Name']}
          paid = {this.props.volunteerInfo[personID]['Paid']}
          hours = {this.props.volunteerInfo[personID]['Hours Credited']}
          hasCar = {this.props.volunteerInfo[personID]['Has Car']}
          checkIn = {this.checkIn}
        />
      );
    });

    return (
      <List>
        {teerListItems};
      </List>
    );
  }


}

export default withStyles(styles)(VolunteerList);
