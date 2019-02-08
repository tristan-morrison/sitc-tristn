import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import loglevel from 'loglevel';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import MobileStepper from '@material-ui/core/MobileStepper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

const styles = theme => ({
  stepperRoot: {
    flexDirection: 'row',
  },
  dotsContainer: {
    flexBasis: '20%',
    justifyContent: 'center',
  }
});

class CheckInDialog extends React.Component {

  constructor () {
    super();

    this.state = {
      open: true,
      viewIndex: 0,
      details: {},
    };

    this.close = this.close.bind(this);
    this.updateViewIndex = this.updateViewIndex.bind(this);
  }

  close () {
    this.setState({open: false});
    this.props.resolve("Resolved the dialog promise!");
    this.props.closeDialog();
  }

  handleStepChange () {

  }

  updateViewIndex (index) {
    this.setState({viewIndex: 1});
  }

  handleBack () {
    this.setState(prevState => ({viewIndex: prevState.viewIndex - 1}));
  }

  render () {
    const firstName = this.props.personInfo['First Name'];
    const { classes } = this.props;

    return (
      <Dialog onClose={this.close} open={this.state.open}>
        <SwipeableViews index={this.state.viewIndex} onChangeIndex={this.handleStepChange} disabled="true">
            <div>
              <DialogContent>
                <DialogContentText>
                  Did {firstName} pay the registration fee today?
                </DialogContentText>
              </DialogContent>
            </div>
            <div>
              <DialogContent>
                <DialogContentText>
                  Can {firstName} drive today?
                </DialogContentText>
              </DialogContent>
            </div>
        </SwipeableViews>
        <MobileStepper
          steps={2}
          position="static"
          activeStep={this.state.viewIndex}
          classes={{root: classes.stepperRoot, dots: classes.dotsContainer}}
          variant="dots"
          backButton={
            <div style={{flexBasis: "40%", justifyContent: 'flex-start'}}>
              {this.state.viewIndex > 0 && (<Button size="small" onClick={this.handleBack} >
                <KeyboardArrowLeft />
                Back
              </Button>)}
            </div>
          }
          nextButton={
            <div style={{display: 'flex', justifyContent: 'flex-end', flexBasis: "40%"}}>
              <Button>No</Button>
              <Button color="primary">Yes</Button>
            </div>
          }
        />
      </Dialog>
    );
  }

}

export default withStyles(styles)(CheckInDialog);
