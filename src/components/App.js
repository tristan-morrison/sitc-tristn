import React from 'React';
import ReactDOM from 'react-dom';
import Airtable from 'airtable';

import { withStyles } from '@material-ui/core/styles';

import VolunteerList from './VolunteerList';
import TristnAppBar from './TristnAppBar';

const styles = theme => ({
  root: {
    width: '100%'
  }
});

class App extends React.Component {


  render () {
    const { classes } = this.props;
    const base = new Airtable({apiKey: 'keydn7CwS79jE483I'}).base('appNWDa6ZElvW44m2');

    base('Profiles').select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 3,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function(record) {
            console.log('Retrieved', record.get('PersonID'));
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
    });

    return (
      <div id="Root" className={classes.root}>
        <TristnAppBar />
        <VolunteerList />
      </div>
    )
  }

}

export default withStyles(styles)(App);
