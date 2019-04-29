import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";

const styles = {
  root: {
    flexGrow: 1
  },
  appBar: {
    color: "DD1523"
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class MenuAppBar extends React.Component {
  state = {
    auth: true,
    anchorEl: null
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <AppBar
        position="static"
        color="primary"
        style={{
          padding: "0px",
          height: "58px",
          marginTop: "50px",
          backgroundColor: "#E3162B"
        }}
      >
        <Toolbar>
          <IconButton
            aria-owns={open ? "menu-appbar" : undefined}
            aria-haspopup="true"
            onClick={this.handleMenu}
            color="inherit"
            className="appBarButton"
          >
            <i className="fas fa-columns" style={{ color: "white" }} />
            <p style={{ color: "white", margin: "10px" }}>Dashboard</p>
          </IconButton>
          <IconButton
            aria-owns={open ? "menu-appbar" : undefined}
            aria-haspopup="true"
            onClick={this.handleMenu}
            color="inherit"
            className="appBarButton"
          >
            <i className="fas fa-trophy" style={{ color: "white" }} />
            <p style={{ color: "white", margin: "10px" }}>Leaderboard</p>
          </IconButton>
          <IconButton
            aria-owns={open ? "menu-appbar" : undefined}
            aria-haspopup="true"
            onClick={this.handleMenu}
            color="inherit"
            className="appBarButton"
          >
            <i className="fas fa-comments" style={{ color: "white" }} />
            <p style={{ color: "white", margin: "10px" }}>Messages</p>
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MenuAppBar);
