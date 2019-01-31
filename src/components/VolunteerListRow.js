import React from 'React';
import * as loglevel from 'loglevel';

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
import Collapse from '@material-ui/core/Collapse';

class VolunteerListRow extends React.Component {

  constructor () {
    super();

    this.state = {
      avatar: '',
    }

    this.handleCheckInClick = this.handleCheckInClick.bind(this);
  }

  componentDidMount () {

  }

  handleCheckInClick (event) {
    this.props.checkIn(this.props.personId, 4);
  }

  render() {

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

    return (
      <ListItem key = {this.props.personId}>
        <ListItemIcon>
          {avatar}
        </ListItemIcon>
        <ListItemText
          primary = {this.props.firstName + ' ' + this.props.lastName}
            secondary = {this.props.hours + ' Hours'}>
        </ListItemText>
        <ListItemSecondaryAction>
          <IconButton aria-label="Check In" onClick={this.handleCheckInClick}>
            <ArrowForwardIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export default VolunteerListRow;
