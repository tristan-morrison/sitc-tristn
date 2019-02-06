import React from 'react';
import {Transition} from 'react-transition-group';
import loglevel from 'loglevel';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  dialogContent: {
    minHeight: "70px",
  },
  exited: {
    display: "none"
  }
});

class CheckInDialog extends React.Component {

  constructor () {
    super();

    this.state = {
      open: true,
      showPayment: false,
      showDriver: true,
    };

    this.close = this.close.bind(this);
  }

  close () {
    this.setState({open: false});
    this.props.closeDialog();
    this.props.resolve("Resolved the dialog promise!");
  }

  render () {
    const { classes } = this.props;
    const firstName = this.props.personInfo['First Name'];

    // hello

    return (
      <Dialog onClose={this.close} open={this.state.open}>
        
      </Dialog>
    );
  }

}

export default withStyles(styles)(CheckInDialog);
