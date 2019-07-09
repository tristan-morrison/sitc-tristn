import React from 'react';
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

class OnSiteListRow extends React.Component {

  constructor () {
    super();

    this.state = {
      show: true
    }

    this.handleSetNotOnSiteClick = this.handleSetNotOnSiteClick.bind(this);
  }

  componentDidMount () {
    // set the icon to go in this person's avatar
    
  }

  handleSetNotOnSiteClick() {
    this.setState({show: false});
    this.props.setNotOnSite(this.props.personId);
  }

  render () {
    const avatar = this.state.avatar;
    const show = !this.props.hide;

    return (
      <Slide in={show} direction="right" timeout={{enter: 0, exit: 300}}>
        <ListItem key = {this.props.personId}>
          <ListItemText
            primary = {this.props.firstName + ' ' + this.props.lastName}>
          </ListItemText>
          <ListItemSecondaryAction>
            <IconButton aria-label="Check In" onClick={this.handleSetNotOnSiteClick}>
              <CloseIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </Slide>
    );
  }

}

export default OnSiteListRow;
