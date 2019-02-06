import React from 'react';
import loglevel from 'loglevel';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({

});

class CheckInDialog extends React.Component {

  constructor () {
    super();

    this.state = {
      open: true,
    };

    this.close = this.close.bind(this);
  }

  close () {
    this.setState({open: false});
    this.props.resolve("Resolved the dialog promise!");
    this.props.closeDialog();
  }

  render () {
    const firstName = this.props.personInfo['First Name'];

    return (
      <Dialog onClose={this.close} open={this.state.open}>
        <DialogContent>
          <Typography>Did {firstName} pay today?</Typography>
        </DialogContent>
      </Dialog>
    );
  }

}

export default withStyles(styles)(CheckInDialog);
