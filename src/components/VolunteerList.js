import React from 'React';
import ReactDOM from 'react-dom';
import Airtable from 'airtable';

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

class VolunteerList extends React.Component {

  // gets volunteer info from the Profiles table
  getInfo () {
    const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.VOLUNTEERS_BASE_ID);

    const volunteerArray = {};

    base('Profiles').select({
      maxRecords: 100,
      view: "Grid view"
    }).eachPage(function (records, fetchNextPage) {
      records.forEach(function (record) {
        volunteerArray[record.get('PersonID')] = record;
      })
    });

    return volunteerArray;
  }

  listRow(personInfo) {

  }

  render() {
    const volunteerInfo = this.getInfo();
    const listRows = volunteerInfo.map((record) => {
      return (
        <ListItem>
          <ListItemText
            primary = {record['First Name']}>
          </ListItemText>
        </ListItem>
      )
    })


  }


}

export default VolunteerList;
