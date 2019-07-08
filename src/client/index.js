import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import * as log from 'loglevel'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import deepOrange from '@material-ui/core/colors/deepOrange';

import App from './components/App';
import ProjectApp from "./components/ProjectApp";
import CarpoolSiteSelect from './components/CarpoolSiteSelect';
import ProjectSiteSelect from './components/projectSite/ProjectSiteSelect';
import AppSelect from "./components/AppSelect";

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
    <BrowserRouter>
      <Switch>
        <Route path='/siteSelect' render={routeProps => (
          < MuiThemeProvider theme = {theme}>
            <AppSelect
              {...routeProps}
            />
          </ MuiThemeProvider>
        )} />
        <Route path="/project" render={routeProps => (
          <MuiThemeProvider theme={theme}>
            <ProjectApp
              {...routeProps}
            />
          </MuiThemeProvider>
        )} />
        <Route path="/" render={routeProps => (
          <MuiThemeProvider theme={theme}>
            <App
              {...routeProps}
            />
          </MuiThemeProvider>
        )} />
      </Switch>
    </BrowserRouter>
  );
}

ReactDOM.render(<Root />, document.querySelector('#app'));

module.hot.accept();
