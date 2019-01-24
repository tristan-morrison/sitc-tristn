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
      volunteerInfo: {}
    };
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

  listRow(personInfo) {

  }

  render() {
    const { classes } = this.props;
    const teerListItems = [];
    const listToRender = (this.props.filteredVolunteerIds.length > 0) ? this.props.filteredVolunteerIds : Object.keys(this.props.volunteerInfo);
    listToRender.forEach((personID) => {

      // set the icon to go in this person's avatar
      let avatarIcon;
      if (this.props.volunteerInfo[personID]['Has Car']) {
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
      if (this.props.volunteerInfo[personID]['Paid']) {
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
          <ListItem key = {this.props.volunteerInfo[personID]['PersonID']}>
            <ListItemIcon>
              {avatar}
            </ListItemIcon>
            <ListItemText
              primary = {this.props.volunteerInfo[personID]['First Name'] + ' ' + this.props.volunteerInfo[personID]['Last Name']}
                secondary = {this.props.volunteerInfo[personID]['Hours Credited'] + ' Hours'}>
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
