import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import MenuAppBar from "../../views/Components/Sections/MenuAppBar";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import headerStyle from "assets/jss/material-kit-react/components/headerStyle.jsx";
import SockJsClient from "react-stomp";
import HeaderLinks from "./HeaderLinks.jsx";
import { base } from "../../constants";
import axios from "axios";
import LeftHeaderLinks from "./LeftHeaderLinks";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      notifications: [],
      newNotification: false
    };
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.headerColorChange = this.headerColorChange.bind(this);
  }

  handleDrawerToggle() {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  }
  componentDidMount() {
    if (this.props.changeColorOnScroll) {
      window.addEventListener("scroll", this.headerColorChange);
    }
  }
  headerColorChange() {
    const { classes, color, changeColorOnScroll } = this.props;
    const windowsScrollTop = window.pageYOffset;
    if (windowsScrollTop > changeColorOnScroll.height) {
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[changeColorOnScroll.color]);
    } else {
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[changeColorOnScroll.color]);
    }
  }
  componentWillUnmount() {
    if (this.props.changeColorOnScroll) {
      window.removeEventListener("scroll", this.headerColorChange);
    }
  }

  handleNotification = msg => {
    if (msg === localStorage.getItem("userId")) {
      axios.get(`${base}/notifications`);
    }
  };

  getNotifications = () => {
    axios
      .get(`${base}/notifications/${localStorage.getItem("userId")}`)
      .then(result => {
        this.setState({ notifications: result.data });
      });
  };

  render() {
    const { classes, color, brand, fixed, absolute } = this.props;
    const appBarClasses = classNames({
      [classes.appBar]: true,
      [classes[color]]: color,
      [classes.absolute]: absolute,
      [classes.fixed]: fixed
    });
    const brandComponent = (
      <Button href={"/"} className={classes.title}>
        {brand}
      </Button>
    );

    return (
      <div>
        <AppBar className={appBarClasses}>
          <Toolbar
            className={classes.container}
            style={{
              marginLeft: "0px",
              maxWidth: "100%",
              border: "0px",
              padding: "0px"
            }}
          >
            {brandComponent}
            <div className={classes.flex}>
              <Hidden smDown implementation="css">
                <LeftHeaderLinks />
              </Hidden>
            </div>
            <Hidden smDown implementation="css">
              {
                <HeaderLinks
                  getNotifications={this.getNotifications}
                  newNotification={this.state.newNotification}
                  notifications={this.state.notifications}
                />
              }
            </Hidden>
            <Hidden mdUp>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerToggle}
              >
                <Menu />
              </IconButton>
            </Hidden>
          </Toolbar>
        </AppBar>
        <MenuAppBar />
        <SockJsClient
          url="http://localhost:8080/ws"
          topics={["/topic/notification"]}
          onMessage={msg => this.handleNotification(msg)}
          ref={client => {
            this.clientRef = client;
          }}
        />
      </div>
    );
  }
}

Header.defaultProp = {
  color: "transparent"
};

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark"
  ]),
  rightLinks: PropTypes.node,
  leftLinks: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
  // this will cause the sidebar to change the color from
  // this.props.color (see above) to changeColorOnScroll.color
  // when the window.pageYOffset is heigher or equal to
  // changeColorOnScroll.height and then when it is smaller than
  // changeColorOnScroll.height change it back to
  // this.props.color (see above)
  changeColorOnScroll: PropTypes.shape({
    height: PropTypes.number.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "info",
      "success",
      "warning",
      "danger",
      "transparent",
      "white",
      "rose",
      "dark"
    ]).isRequired
  })
};

export default withStyles(headerStyle)(Header);
