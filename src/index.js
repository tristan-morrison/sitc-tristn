import React from 'react';
import ReactDOM from 'react-dom';
import * as log from 'loglevel'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import deepOrange from '@material-ui/core/colors/deepOrange';

import App from './components/App';

log.setLevel("trace");

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: deepOrange
  },
  typography: {
    useNextVariants: true,
  },
});

function Root() {
  return (

    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>

  );
}

ReactDOM.render(<Root />, document.querySelector('#app'));

module.hot.accept();
