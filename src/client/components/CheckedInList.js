import React from 'React';
import Airtable from 'airtable';
import * as loglevel from 'loglevel';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import CheckedInListRow from './CheckedInListRow';
import sitcAirtable from './../api/sitcAirtable';

const styles = theme => ({
});

class CheckedInList extends React.Component {

  constructor () {
    super();

    this.checkOut = this.checkOut.bind(this);
  }

  componentDidMount () {
    loglevel.info("mounted CheckedInList!");
    this.props.setTabIndex(1);
  }

  checkOut (personId) {
    loglevel.info('checking out ' + personId);
    sitcAirtable.checkOut(personId).then(deletedRecord => {
      loglevel.info("Deleted record " + deletedRecord);
    })
  }

  render () {
    const teerListItems = [];
    this.props.listToRender.forEach(personID => {
      teerListItems.push(
        <CheckedInListRow
          personId = {personID}
          firstName = {this.props.volunteerInfo[personID]['First Name']}
          lastName = {this.props.volunteerInfo[personID]['Last Name']}
          paid = {this.props.volunteerInfo[personID]['Paid']}
          hours = {this.props.volunteerInfo[personID]['Hours Credited']}
          hasCar = {this.props.volunteerInfo[personID]['Has Car']}
          checkOut = {this.checkOut}
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

export default withStyles(styles)(CheckedInList);
