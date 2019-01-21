import React from 'react';
import ReactDOM from 'react-dom';
import * as log from 'loglevel'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import App from './components/App';

log.setLevel("trace");

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

function Root() {
  return (

    <MuiThemeProvider theme={theme}>
      <div>
        <Typography variant="h2">Hello, World!</Typography>
        <Button variant="contained" color="primary">
          Hello World
        </Button>
      </div>
      <App />
    </MuiThemeProvider>

  );
}

ReactDOM.render(<Root />, document.querySelector('#app'));

module.hot.accept();
