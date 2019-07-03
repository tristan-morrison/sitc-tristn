import React from 'react';
import loglevel from 'loglevel';
import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import deepPurple from '@material-ui/core/colors/deepPurple';
import deepOrange from '@material-ui/core/colors/deepOrange';
import indigo from '@material-ui/core/colors/indigo';
import cyan from '@material-ui/core/colors/cyan';
import teal from '@material-ui/core/colors/teal';
import lightGreen from '@material-ui/core/colors/lightGreen';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

const COLORS = [
  'deepPurple',
  'deepOrange',
  'indigo',
  'cyan',
  'teal',
  'lightGreen',
  'pink',
  'red',
]

const styles = theme => ({
  deepPurple: {
    backgroundColor: deepPurple[500]
  },
  deepOrange: {
    backgroundColor: deepOrange[500]
  },
  indigo: {
    backgroundColor: indigo[500]
  },
  cyan: {
    backgroundColor: cyan[500]
  },
  teal: {
    backgroundColor: teal[500]
  },
  lightGreen: {
    backgroundColor: lightGreen[500]
  },
  pink: {
    backgroundColor: pink[500]
  },
  red: {
    backgroundColor: red[500]
  },
});

/*
 * Props
 * getSites - function; returns a promise that resolves to an object containing the sites
 * type - string; either "carpool" or "project"
 * localStorageItemId - key id of record in localStorage to which the id of the selected site should be saved
 */

class SiteSelect extends React.Component {

  constructor () {
    super();

    this.state = {
      open: false,
      sites: [],
    }
  }

  componentDidMount () {
    const sitesPromise = this.props.getSites();
    sitesPromise.then(sites => this.setState({sites: sites, open: true}));
  }

  close () {
    loglevel.info("Closing dialog!");
    this.setState({ open: false })
  }

  handleClick (siteId) {
    localStorage.setItem(this.props.localStorageItemId, siteId);
    this.setState({open: false});
    this.props.history.push("/");
  }

  render () {
    const { classes } = this.props;
    const { sites } = this.state;

    return (
      <Dialog onClose={this.close} open={this.state.open}>
        <DialogTitle>Set {this.props.type} site</DialogTitle>
        <div>
          <List>
            {Object.keys(this.state.sites).map(siteId => (
              <ListItem button onClick={() => this.handleClick(siteId)} key={siteId}>
                <ListItemAvatar>
                  <Avatar className={classes[COLORS.splice(Math.floor(Math.random() * COLORS.length), 1)[0]]}>
                    {sites[siteId]['Initials']}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={sites[siteId]['Shortname']}/>
              </ListItem>
            ))}
          </List>
        </div>
      </Dialog>
    );
  }

}

export default withRouter(withStyles(styles)(SiteSelect));
