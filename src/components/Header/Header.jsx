import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import Menu from "@material-ui/icons/Menu";
import headerStyle from "assets/jss/material-kit-react/components/headerStyle.jsx";
import HeaderLinks from "./HeaderLinks.jsx";
import LeftHeaderLinks from "./LeftHeaderLinks";
import SignInModal from "./SignInModal";
import gql from "graphql-tag";
import {apolloClient} from "../../utils";

const SIGN_IN_USER = gql`
    query signInUser($username: String, $password: String) {
        signInUser(username: $username, password: $password) {
            accessToken
            tokenType
            username
            publicAddress
            userAvatar
            userId
        }
    }`;

class Header extends React.Component {
    state = {
        mobileOpen: false,
        signInModal: false,
        web3: null,
        assistInstance: null,
        username: "",
        password: ""
    };

    handleSimple = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen});
    };

    componentDidMount = () => {
        if (this.props.changeColorOnScroll) {
            window.addEventListener("scroll", this.headerColorChange);
        }
    };

    headerColorChange = () => {
        const {classes, color, changeColorOnScroll} = this.props;
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
    };

    componentWillUnmount = () => {
        if (this.props.changeColorOnScroll) {
            window.removeEventListener("scroll", this.headerColorChange);
        }
    };

    commenceSignIn = () => {
        this.activateModal("signInModal");
    };

    activateModal = modal => {
        const x = [];
        x[modal] = true;
        this.setState(x);
    };

    closeModal = modal => {
        const x = [];
        x[modal] = false;
        this.setState(x);
    };

    signIn = () => {
        apolloClient.query({
                variables: {username: this.state.username, password: this.state.password},
                query: SIGN_IN_USER
            }).then((res) => {
                const data = res.data.signInUser;
            localStorage.setItem("username", data.username);
            localStorage.setItem(
                "publicAddress",
                data.publicAddress
            );
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("jwtToken", data.accessToken);
            localStorage.setItem("userAvatar", data.userAvatar);
            this.closeModal("signInModal");
        }).catch((err) => {
            console.error({err});
        })
    };

    render = () => {
        const {
            classes,
            color,
            brand,
            fixed,
            absolute
        } = this.props;
        const appBarClasses = classNames({
            [classes.appBar]: true,
            [classes[color]]: color,
            [classes.absolute]: absolute,
            [classes.fixed]: fixed
        });
        const brandComponent = (
            <Button onClick={() => {
                this.props.history.push("/")
            }} className={classes.title}>
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
                                <LeftHeaderLinks history={this.props.history}/>
                            </Hidden>
                        </div>
                        <Hidden smDown implementation="css">
                            <HeaderLinks commenceSignIn={this.commenceSignIn} history={this.props.history}/>
                        </Hidden>
                        <Hidden mdUp>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={this.handleDrawerToggle}
                            >
                                <Menu/>
                            </IconButton>
                        </Hidden>
                    </Toolbar>
                </AppBar>
                <Hidden mdUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor={"right"}
                        open={this.state.mobileOpen}
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        onClose={this.handleDrawerToggle}
                    >
                        <div className={classes.appResponsive}>
                            <LeftHeaderLinks history={this.props.history}/>
                            <HeaderLinks commenceSignIn={this.commenceSignIn} history={this.props.history}/>
                        </div>
                    </Drawer>
                </Hidden>
                <SignInModal
                    openState={this.state.signInModal}
                    closeModal={this.closeModal}
                    handleSimple={this.handleSimple}
                    signIn={this.signIn}
                />
                <br/>
                <br/>
                <br/>
            </div>
        );
    };
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
