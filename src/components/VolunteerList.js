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
    this.state = {
      volunteerInfo: {}
    };

    this.checkIn = this.checkIn.bind(this);
  }

  // gets volunteer info from the Profiles table
  componentDidMount () {
    let self = this;

    const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE_ID);

    const volunteers = {};

    base(AIRTABLE.PROFILES_TABLE).select({
      maxRecords: 100,
      view: "Grid view"
    }).eachPage((records, fetchNextPage) => {
        records.forEach(function (record) {
          loglevel.debug(record.fields['PersonID']);
          volunteers[record.fields['PersonID']] = record.fields;
        });

        fetchNextPage();
    }, (err) => {
        if (err) {
          loglevel.error(err);
        }
        // self.setState({
        //   volunteerInfo: volunteers
        // });
        this.props.updateVolunteerInfo(volunteers);
      });

    const myPromise = sitcAirtable.getAttendanceRecordsToday();
    myPromise.then(info => this.props.updateCheckedInTeers(info));
  }

  checkIn (personId, hours) {
    if (this.props.checkedInTeers.includes(personId)) {
      loglevel.error("This person is already checked in!!");
      return -1;
    }
    sitcAirtable.checkIn(personId, hours).then(code => {
      loglevel.info("Checked in!");
      this.props.updateCheckedInTeers(this.props.checkedInTeers.concat([personId]))
      loglevel.info(this.props.checkedInTeers);
    }, err => loglevel.error("Error with the server call!"));
  }

  render() {
    const { classes } = this.props;
    const teerListItems = [];
    const listToRender = (this.props.filteredVolunteerIds.length > 0) ? this.props.filteredVolunteerIds : Object.keys(this.props.volunteerInfo);
    listToRender.forEach((personID) => {
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
