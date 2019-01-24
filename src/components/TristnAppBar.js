import React from 'React';
import ReactDOM from 'react-dom';
import 'fuse.js';
import * as loglevel from 'loglevel';

import { withStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Input from '@material-ui/core/Input';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

const styles = theme => ({
  root: {
  },
  growSpacer: {
    width: '50px',
    height: '100%',
    flexGrow: 1
  },
  searchIcon: {
    width: theme.spacing.unit,
    marginLeft: theme.spacing.unit * 1.5,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    position: 'relative',
    transition: theme.transitions.create('width'),
    minWidth: theme.spacing.unit * 4,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: 'auto',
    [theme.breakpoints.up('sm')]: {
      // marginLeft: theme.spacing.unit,
    },
    [theme.breakpoints.down('sm')]: {
      width: 32
    }
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit* 5,
      // width: 120,
      '&:focus': {
        // width: 200
      }
    },
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit* 5,
      width: '100%',
      '&:focus': {
        // width: 500
      }
    },
    '&$underline:before': {
      borderBottom: 0
    }
  }
});

class TristnAppBar extends React.Component {

  constructor () {
    super();

    this.state = {
      searchText: '',
      searchIsFocused: false,
    }

    this.updateSearchText = this.updateSearchText.bind(this);
    this.onSearchFocused = this.onSearchFocused.bind(this);
    this.onSearchBlur = this.onSearchBlur.bind(this);
  }

  updateSearchText (event) {
    loglevel.debug(event.target.value);
    this.setState({searchText: event.target.value});
  }

  onSearchBlur () {
    this.setState({searchIsFocused: !this.state.searchIsFocused});
  }

  onSearchFocused () {
    this.setState({searchIsFocused: !this.state.searchIsFocused});
  }


  render() {
    const { classes } = this.props;
    loglevel.info(this.props.theme.breakpoints.up('sm'));

    let searchContainerStyle = {};
    let searchInputStyle = {};
    if (this.state.searchIsFocused) {
      searchContainerStyle = {
        width: 500
      }
    }
    else {
      if (this.state.searchText.length > 0) {
        searchContainerStyle = {
          width: (this.state.searchText.length * 8) + 50
        }
      } else {
        searchInputStyle = {
          padding: 0
        }
      }
    }



    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton aria-label="Open menu drawer" color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            Tristn
          </Typography>
          <div className={classes.growSpacer}></div>
          <div className={classes.searchContainer} style={searchContainerStyle}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <Input
              disableUnderline = "true"
              value = {this.state.searchText}
              onChange = {this.updateSearchText}
              onFocus = {this.onSearchFocused}
              onBlur = {this.onSearchBlur}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              style={searchInputStyle}
            />
          </div>
        </Toolbar>
      </AppBar>
    );

  }

}

export default withStyles(styles, { withTheme: true})(TristnAppBar);
