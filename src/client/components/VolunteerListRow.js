import React from 'react';
import * as loglevel from 'loglevel';
// import { Transition } from 'react-transition-group';

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
import Slide from '@material-ui/core/Slide';

class VolunteerListRow extends React.Component {

  constructor () {
    super();

    this.state = {
      avatar: '',
      // show: true
    }

    this.handleCheckInClick = this.handleCheckInClick.bind(this);
    this.exited = this.exited.bind(this);
  }

  exited () {
    loglevel.info("componentWillUnmount ran!");
  }

  handleCheckInClick (event) {
    // this.props.checkIn(this.props.personId, 4);
    const dialogPromise = this.props.checkInDialog(this.props.personId);
    dialogPromise.then(info => this.props.checkIn(this.props.personId));
    loglevel.info("I got clicked!" + this.props.personId);
    // this.setState({show: false});
  }

  render() {

    const show = !this.props.hide;

    // set the icon to go in this person's avatar
    let avatarIcon;
    if (this.props.hasCar) {
      avatarIcon = (
        <DriveEtaIcon />
      );
    } else {
      avatarIcon = (
        <AirlineSeatReclineNormalIcon />
      );
    }

    let avatar = ''
    // set up the avatar with or without a badge
    // this.state.avatar = '';
    if (this.props.paid) {
      // this.setState({avatar: avatarIcon});
      avatar = avatarIcon;
    } else {
      const content = (
        <Badge badgeContent="$" color="secondary">
          {avatarIcon}
        </Badge>
      );
      // this.setState({avatar: content});
      avatar = content;
    }

    let carpoolSiteName = ""
    if (this.props.projectPreference) {
      carpoolSiteName = " | " + this.props.projectPreference;
    } else if (this.props.primaryCarpoolSite) {
      carpoolSiteName = " | " + this.props.carpoolSites[this.props.primaryCarpoolSite]['Shortname'];
    }


    return (
      <Slide in={show} onExited={this.exited} direction="left" timeout={{enter: 0, exit: 300}}>
        <ListItem key = {this.props.personId}>
          <ListItemIcon>
            {avatar}
          </ListItemIcon>
          <ListItemText
            primary = {this.props.firstName + ' ' + this.props.lastName}
            secondary = {this.props.hours + carpoolSiteName}>
          </ListItemText>
          <ListItemSecondaryAction>
            <IconButton aria-label="Check In" onClick={this.handleCheckInClick}>
              <ArrowForwardIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        </Slide>
    );
  }
}

export default VolunteerListRow;
