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
import AirlineSeatReclineNormalIcon from '@material-ui/icons/AirlineSeatReclineNormal';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import RemoveIcon from '@material-ui/icons/Remove';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';
import ExposurePlus2Icon from '@material-ui/icons/ExposurePlus2';

import { ORG } from './../constants';

const INDEX_TO_PROP = ['paidToday', 'canDrive'];

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
  },
  icon: {
    marginTop: '6px',
  },
  iconTransparent: {
    opacity: 0
  },
  nextButton: {
    marginLeft: '10px'
  }
});

class NextButton extends React.Component {
  constructor () {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick () {
    if (this.props.isLastSlide) {
      if (this.props.buttonVal) {
        this.props.handleConfirm();
      } else {
        this.props.cancel()
      }
    } else {
      this.props.handleNext(this.props.buttonVal);
    }
  }

  render () {
    return (
      <Button
        variant={this.props.buttonVariant || 'text'}
        color={this.props.buttonColor || 'default'}
        onClick={this.handleClick}
        className={this.props.myClassName}
        >
          {this.props.children}
      </Button>
    );
  }
}

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
    this.handleNext = this.handleNext.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
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

  handleNext (propVal) {
    const index = this.state.viewsToShow[0];
    const prop = INDEX_TO_PROP[index];

    // if setting paidToday to true, also set amountPaid to default registration fee
    let updatedAmountPaid = this.state.details.amountPaid;
    if (index == 0) {
      if (propVal) {
        updatedAmountPaid = ORG.REGISTRATION_FEE;
      } else {
        updatedAmountPaid = 0;
      }
    }

    let updatedHours = this.state.details.hours;
    if (index == 1) {
      if (propVal) {
        updatedHours = ORG.DRIVER_HOURS;
      } else {
        updatedHours = ORG.DEFAULT_HOURS;
      }
    }

    this.setState(prevState => ({
      details: {
        ...prevState.details,
        [prop]: propVal,
        amountPaid: updatedAmountPaid,
        hours: updatedHours,
      }
    }));

    this.popView();
  }

  handleConfirm () {
    this.props.resolve(this.state.details);
    this.close();
  }

  render () {
    const firstName = this.props.personInfo['First Name'];
    const isLastSlide = this.state.viewsToShow[0] == 2;
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
                    {this.props.personInfo['Paid'] && (
                      <React.Fragment>
                        <TableCell
                          padding="dense"
                          align="right"
                          classes={{alignRight: classes.alignRight}}
                          >
                            <Check className={classes.icon} />
                        </TableCell>
                        <TableCell
                          padding="dense"
                          align="left"
                          classes={{alignLeft: classes.alignLeft }}
                          >
                            <div className={classes.cellDiv}>
                              <Typography variant='subtitle2'>Already Paid</Typography>
                            </div>
                        </TableCell>
                      </React.Fragment>
                    )}
                    {!this.props.personInfo['Paid'] && !this.state.details.paidToday && (
                      <React.Fragment>
                        <TableCell
                          padding="dense"
                          align="right"
                          classes={{alignRight: classes.alignRight}}
                          >
                            <PriorityHigh className={classes.icon} />
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
                        <TableCell
                          padding="dense"
                          align="right"
                          classes={{alignRight: classes.alignRight}}
                          >
                            <AttachMoney className={classes.icon} />
                        </TableCell>
                        <TableCell
                          padding="dense"
                          align="left"
                          classes={{alignLeft: classes.alignLeft }}
                          >
                            <div className={classes.cellDiv}>
                              <Typography variant='subtitle2'>Paid ${this.state.details.amountPaid}.00</Typography>
                            </div>
                        </TableCell>
                      </React.Fragment>
                    )}
                </TableRow>
                <TableRow>
                  <TableCell>Driving</TableCell>
                  {this.state.details.canDrive && (
                    <React.Fragment>
                      <TableCell
                        padding="dense"
                        align="right"
                        classes={{alignRight: classes.alignRight}}
                        >
                          <DriveEtaIcon className={classes.icon} />
                      </TableCell>
                      <TableCell
                        padding="dense"
                        align="left"
                        classes={{alignLeft: classes.alignLeft }}
                        >
                          <div className={classes.cellDiv}>
                            <Typography variant='subtitle2'>Yes</Typography>
                          </div>
                      </TableCell>
                    </React.Fragment>
                  )}
                  {!this.state.details.canDrive && (
                    <React.Fragment>
                      <TableCell
                        padding="dense"
                        align="right"
                        classes={{alignRight: classes.alignRight}}
                        >
                          <AirlineSeatReclineNormalIcon className={classes.icon} />
                      </TableCell>
                      <TableCell
                        padding="dense"
                        align="left"
                        classes={{alignLeft: classes.alignLeft }}
                        >
                          <div className={classes.cellDiv}>
                            <Typography variant='subtitle2'>No</Typography>
                          </div>
                      </TableCell>
                    </React.Fragment>
                  )}
                </TableRow>
                <TableRow>
                  <TableCell>Hours</TableCell>
                  {this.state.details.hours <= ORG.DEFAULT_HOURS && (
                    <React.Fragment>
                      <TableCell
                        padding="dense"
                        align="right"
                        classes={{alignRight: classes.alignRight}}
                        >
                          <IndeterminateCheckBoxIcon className={classes.iconTransparent} />
                      </TableCell>
                      <TableCell
                        padding="dense"
                        align="left"
                        classes={{alignLeft: classes.alignLeft }}
                        >
                          <div className={classes.cellDiv}>
                            <Typography variant='subtitle2'>{this.state.details.hours}</Typography>
                          </div>
                      </TableCell>
                    </React.Fragment>
                  )}
                  {this.state.details.hours == ORG.DEFAULT_HOURS + 1 && (
                    <React.Fragment>
                      <TableCell
                        padding="dense"
                        align="right"
                        classes={{alignRight: classes.alignRight}}
                        >
                          <PlusOneIcon className={classes.icon} />
                      </TableCell>
                      <TableCell
                        padding="dense"
                        align="left"
                        classes={{alignLeft: classes.alignLeft }}
                        >
                          <div className={classes.cellDiv}>
                            <Typography variant='subtitle2'>{this.state.details.hours}</Typography>
                          </div>
                      </TableCell>
                    </React.Fragment>
                  )}
                  {this.state.details.hours == ORG.DEFAULT_HOURS + 2 && (
                    <React.Fragment>
                      <TableCell
                        padding="dense"
                        align="right"
                        classes={{alignRight: classes.alignRight}}
                        >
                          <ExposurePlus2Icon className={classes.icon} />
                      </TableCell>
                      <TableCell
                        padding="dense"
                        align="left"
                        classes={{alignLeft: classes.alignLeft }}
                        >
                          <div className={classes.cellDiv}>
                            <Typography variant='subtitle2'>{this.state.details.hours}</Typography>
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
              {this.state.viewsShown.length > 0 && (
                <Button size="small" onClick={this.handleBack} >
                  <KeyboardArrowLeft />
                  Back
                </Button>)}
            </div>
          }
          nextButton={
            <div style={{display: 'flex', justifyContent: 'flex-end', flexBasis: "40%"}}>
              {!isLastSlide && (
                <React.Fragment>
                  <NextButton handleNext={this.handleNext} buttonVal={false}>No</NextButton>
                  <NextButton
                    handleNext={this.handleNext}
                    buttonVal={true}
                    buttonColor="primary"
                    isLastSlide={isLastSlide}
                    >
                    Yes
                  </NextButton>
                </React.Fragment>
              )}
              {isLastSlide && (
                <React.Fragment>
                  <NextButton
                    cancel={this.close}
                    buttonVal={false}
                    buttonVariant="outlined"
                    isLastSlide={true}
                    >
                    Cancel
                  </NextButton>
                  <NextButton
                    handleConfirm={this.handleConfirm}
                    buttonVal={true}
                    isLastSlide={isLastSlide}
                    buttonVariant="contained"
                    buttonColor="primary"
                    myClassName={classes.nextButton}
                    >
                    Confirm
                  </NextButton>
                </React.Fragment>
              )}
            </div>
          }
        />
      </Dialog>
    );
  }

}

export default withStyles(styles)(CheckInDialog);
