import React from 'react';
import ReactDOM from 'react-dom';
import Airtable from 'airtable';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

function App() {

  return (
    <MuiThemeProvider theme={theme}>
      <div>
        <Typography variant="h2">Hello, World!</Typography>
        <Button variant="contained" color="primary">
          Hello World
        </Button>
      </div>
    </MuiThemeProvider>

  );
}

ReactDOM.render(<App />, document.querySelector('#app'));

module.hot.accept();
