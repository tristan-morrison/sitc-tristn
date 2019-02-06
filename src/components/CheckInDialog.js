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
import Collapse from '@material-ui/core/Collapse';

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
        <Transition in={false} timeout={1000}>
          <div className={classes['exited']}>
            <DialogContent className={classes.dialogContent}>
              <DialogContentText>
                Did {firstName} pay the registration fee today?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button>
                No
              </Button>
              <Button color="primary">
                Yes
              </Button>
            </DialogActions>
          </div>
        </Transition>
        <Transition in={this.state.showDriver} timeout={1000}>
          <div>
            <DialogContent className={classes.dialogContent}>
              <DialogContentText>
                Can {firstName} drive today?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button>
                No
              </Button>
              <Button color="primary">
                Yes
              </Button>
            </DialogActions>
          </div>
        </Transition>
      </Dialog>
    );
  }

}

export default withStyles(styles)(CheckInDialog);
