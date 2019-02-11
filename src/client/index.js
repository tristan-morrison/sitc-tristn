import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import * as log from 'loglevel'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import deepOrange from '@material-ui/core/colors/deepOrange';

import Auth from './api/Auth.js';
// import GoogleOAuth from './api/GoogleOAuth';
import App from './components/App';
import SiteSelect from './components/SiteSelect';

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
  const myAuth = new Auth();

  return (
    <BrowserRouter>
      <Switch>
        <Route path='/siteSelect' render={routeProps => (
          <SiteSelect
            auth={myAuth}
          />
        )} />
        <Route path="/" render={routeProps => (
          <MuiThemeProvider theme={theme}>
            <App
              {...routeProps}
              auth={myAuth}
            />
          </MuiThemeProvider>
        )} />
      </Switch>
    </BrowserRouter>
  );
}

ReactDOM.render(<Root />, document.querySelector('#app'));

module.hot.accept();
