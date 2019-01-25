import React from 'React';
import ReactDOM from 'react-dom';
import Airtable from 'airtable';
import * as loglevel from 'loglevel';

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

    const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.VOLUNTEERS_BASE_ID);

    const volunteers = {};

    base('Profiles').select({
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
  }

  checkIn (personId, hours) {
    sitcAirtable.checkIn(personId, hours);
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
