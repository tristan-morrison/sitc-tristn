import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import loglevel from 'loglevel';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import MobileStepper from '@material-ui/core/MobileStepper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Check from '@material-ui/icons/Check';
import PriorityHigh from '@material-ui/icons/PriorityHigh';

const styles = theme => ({
  stepperRoot: {
    flexDirection: 'row',
  },
  dotsContainer: {
    flexBasis: '20%',
    justifyContent: 'center',
  },
  dotsContainerTransparent: {
    flexBasis: '20%',
    justifyContent: 'center',
    opacity: 0,
  },
  paymentInput: {
    width: '110px',
  },
  hoursInput: {
    width: '55px',
  },
  formGroupRoot: {
    marginTop: '20px',
  },
  formControlLabelRoot: {
    paddingTop: '10px',
  },
  textFieldRoot: {
    marginLeft: '15px',
  },
  cellDiv: {
    display: 'flex',
    alignItems: 'center',
  },
  alignRight: {
    paddingRight: '3px',
  },
  alignLeft: {
    paddingLeft: '3px',
  }
});

class CheckInDialog extends React.Component {

  constructor () {
    super();

    this.state = {
      open: true,
      viewIndex: 0,
      details: {
        canDrive: false,
        paidToday: false,
        amountPaid: 0,
        hours: 4,
      },
      viewsToShow: [2],
      viewsShown: [],
      totalViewsToShow: 1,
    };

    this.close = this.close.bind(this);
    this.updateViewIndex = this.updateViewIndex.bind(this);
    this.popView = this.popView.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  componentDidMount () {
    const updatedViewsToShow = this.state.viewsToShow.slice();

    if (this.props.personInfo['Has Car']) {
      updatedViewsToShow.unshift(1);
    }

    if (!this.props.personInfo['Paid']) {
      updatedViewsToShow.unshift(0);
    }

    this.setState({ viewsToShow: updatedViewsToShow, totalViewsToShow: updatedViewsToShow.length, showBackButton: (updatedViewsToShow.length > 1) ? true : false});
  }

  close () {
    this.setState({open: false});
    this.props.resolve("Resolved the dialog promise!");
    this.props.closeDialog();
  }

  popView () {
    const updatedViewsToShow = this.state.viewsToShow.slice();
    const updatedViewsShown = this.state.viewsShown.slice();
    const oldView = updatedViewsToShow.shift();
    updatedViewsShown.push(oldView);
    this.setState({ viewsToShow: updatedViewsToShow, viewsShown: updatedViewsShown});
  }

  updateViewIndex (index) {
    this.setState({viewIndex: 1});
  }

  handleBack () {
    const updatedViewsToShow = this.state.viewsToShow.slice();
    const updatedViewsShown = this.state.viewsShown.slice();
    const nextView = updatedViewsShown.pop();
    updatedViewsToShow.unshift(nextView);
    this.setState({viewsToShow: updatedViewsToShow, viewsShown: updatedViewsShown});
  }

  render () {
    const firstName = this.props.personInfo['First Name'];
    const { classes } = this.props;

    return (
      <Dialog onClose={this.close} open={this.state.open}>
        <SwipeableViews index={this.state.viewsToShow[0]} onChangeIndex={this.handleStepChange} disabled={true}>
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
          <div>
            <Table>
              <TableBody>
                <TableRow>
                    <TableCell>Payment</TableCell>
                    {this.props.hasPaid && (
                      <TableCell>
                        <div className={classes.cellDiv}>
                          <Check />
                          <Typography variant='subtitle2'>Already Paid</Typography>
                        </div>
                      </TableCell>
                    )}
                    {!this.props.hasPaid && (
                      <React.Fragment>
                        <TableCell
                          padding="dense"
                          align="right"
                          classes={{alignRight: classes.alignRight}}
                          >
                            <PriorityHigh />
                        </TableCell>
                        <TableCell
                          padding="dense"
                          align="left"
                          classes={{alignLeft: classes.alignLeft }}
                          >
                            <div className={classes.cellDiv}>
                              <Typography variant='subtitle2'>Not Paid</Typography>
                            </div>
                        </TableCell>
                      </React.Fragment>
                    )}
                    {this.state.details.paidToday && (
                      <React.Fragment>
                        <TableCell>
                          <AttachMoney />
                        </TableCell>
                        <TableCell>
                          <div className={classes.cellDiv}>
                            <Typography variant='subtitle2'>Paid ${40}.00</Typography>
                          </div>
                        </TableCell>
                      </React.Fragment>
                    )}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </SwipeableViews>
        <MobileStepper
          steps={this.state.totalViewsToShow}
          position="static"
          activeStep={this.state.viewsToShow[0]}
          classes={{root: classes.stepperRoot, dots: (this.state.totalViewsToShow > 1) ? classes.dotsContainer : classes.dotsContainerTransparent}}
          variant="dots"
          backButton={
            <div style={{flexBasis: "40%", justifyContent: 'flex-start'}}>
              {this.state.viewsShown.length > 0 && (<Button size="small" onClick={this.handleBack} >
                <KeyboardArrowLeft />
                Back
              </Button>)}
            </div>
          }
          nextButton={
            <div style={{display: 'flex', justifyContent: 'flex-end', flexBasis: "40%"}}>
              <Button>No</Button>
              <Button color="primary" onClick={this.popView}>Yes</Button>
            </div>
          }
        />
      </Dialog>
    );
  }

}

export default withStyles(styles)(CheckInDialog);
