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
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

class CheckedInListRow extends React.Component {

  constructor () {
    super();

    this.state = {
      show: true
    }

    this.handleCheckOutClick = this.handleCheckOutClick.bind(this);
  }

  componentDidMount () {
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

    // set up the avatar with or without a badge
    this.state.avatar = '';
    if (this.props.paid) {
      this.setState({avatar: avatarIcon});
    } else {
      const content = (
        <Badge badgeContent="$" color="secondary">
          {avatarIcon}
        </Badge>
      );
      this.setState({avatar: content});
    }
  }

  handleCheckOutClick() {
    this.setState({show: false});
    this.props.checkOut(this.props.attendanceRecordId, this.props.personId);
  }

  render () {
    const avatar = this.state.avatar;
    const show = !this.props.hide;

    return (
      <Slide in={show} direction="right" timeout={{enter: 0, exit: 300}}>
        <ListItem key = {this.props.personId}>
          <ListItemIcon>
            {avatar}
          </ListItemIcon>
          <ListItemText
            primary = {this.props.firstName + ' ' + this.props.lastName}
              secondary = {this.props.hours + ' Hours'}>
          </ListItemText>
          <ListItemSecondaryAction>
            <IconButton aria-label="Check In" onClick={this.handleCheckOutClick}>
              <CloseIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </Slide>
    );
  }

}

export default CheckedInListRow;
