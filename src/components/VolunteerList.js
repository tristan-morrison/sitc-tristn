import React from 'React';
import ReactDOM from 'react-dom';
import Airtable from 'airtable';
import * as loglevel from 'loglevel';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import SvgIcon from '@material-ui/core/SvgIcon';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import AirlineSeatReclineNormalIcon from '@material-ui/icons/AirlineSeatReclineNormal';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const styles = theme => ({
  avatar: {
    backgroundColor: theme.palette.primary[500]
  }
});

class VolunteerList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      volunteerInfo: []
    };
  }

  // gets volunteer info from the Profiles table
  componentDidMount () {
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
    const { classes } = this.props;
    const teerListItems = [];
    this.state.volunteerInfo.forEach((record) => {

      // set the icon to go in this person's avatar
      let avatarIcon;
      if (record.get('Has Car')) {
        avatarIcon = (
          <DriveEtaIcon />
        );
      } else {
        avatarIcon = (
          <AirlineSeatReclineNormalIcon />
        );
      }

      // set up the avatar with or without a badge
      let avatar = '';
      if (record.get('Paid')) {
        avatar = avatarIcon;
      } else {
        avatar = (
          <Badge badgeContent="$" color="secondary">
            {avatarIcon}
          </Badge>
        );
      }

      return (
        teerListItems.push(
          <ListItem key = {record.get('PersonID')}>
            <ListItemIcon>
              {avatar}
            </ListItemIcon>
            <ListItemText
              primary = {record.get('First Name') + ' ' + record.get('Last Name')}
              secondary = {record.get('Hours Credited') + ' Hours'}>
            </ListItemText>
            <ListItemSecondaryAction>
              <IconButton aria-label="Check In">
                <ArrowForwardIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )
      )
    })

    return (
      <List>
        {teerListItems};
      </List>
    );
  }


}

export default withStyles(styles)(VolunteerList);
