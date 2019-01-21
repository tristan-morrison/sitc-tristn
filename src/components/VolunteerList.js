import React from 'React';
import ReactDOM from 'react-dom';
import Airtable from 'airtable';
import * as loglevel from 'loglevel';

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import SvgIcon from '@material-ui/core/SvgIcon';

class VolunteerList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      volunteerInfo: []
    };
  }

  // gets volunteer info from the Profiles table
  componentWillMount () {
    let self = this;

    const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.VOLUNTEERS_BASE_ID);

    const volunteerArray = [];

    base('Profiles').select({
      maxRecords: 100,
      view: "Grid view"
    }).eachPage((records, fetchNextPage) => {
        records.forEach(function (record) {
          loglevel.debug(record.get('PersonID'));
          volunteerArray.push(record);
        });

        fetchNextPage();
    }, (err) => {
        if (err) {
          loglevel.error(err);
        }
        self.setState({
          volunteerInfo: volunteerArray
        });
      });
  }

  listRow(personInfo) {

  }

  render() {
    const teerListItems = [];
    this.state.volunteerInfo.forEach((record) => {
      teerListItems.push(
        <ListItem key = {record.get('PersonID')}>
          <ListItemAvatar>
            <SvgIcon>
              <rect x="4.8" y="14.6" transform="matrix(0.6211 -0.7837 0.7837 0.6211 -8.8542 13.1528)" width="8.7" height="2.2"/>
              <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10c5.5,0,10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8
              S16.4,20,12,20z"/>
              <path style={{fill:'none'}} d="M0,0h24v24H0V0z"/>
              <rect x="3.2" y="11.2" width="18" height="2.2"/>
              <rect x="14" y="11.4" transform="matrix(0.7837 -0.6211 0.6211 0.7837 -6.4938 12.8169)" width="2.2" height="8.7"/>
              <ellipse cx="12" cy="12" rx="4.2" ry="4.2"/>
              <path style={{fill:'#FFFFFF'}} d="M12,8.4c1.9,0,3.5,1.6,3.5,3.6s-1.6,3.6-3.5,3.6S8.5,14,8.5,12S10.1,8.4,12,8.4 M12,6.7
              c-2.9,0-5.2,2.4-5.2,5.3s2.3,5.3,5.2,5.3s5.2-2.4,5.2-5.3S14.9,6.7,12,6.7L12,6.7z"/>

            </SvgIcon>
          </ListItemAvatar>
          <ListItemText
            primary = {record.get('First Name')}>
          </ListItemText>
        </ListItem>
      );
    })

    return (
      <List>
        {teerListItems};
      </List>
    );
  }


}

export default VolunteerList;
