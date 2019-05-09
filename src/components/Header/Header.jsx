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
import Drawer from "@material-ui/core/Drawer";
import MenuAppBar from "../../views/Components/Sections/MenuAppBar";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import headerStyle from "assets/jss/material-kit-react/components/headerStyle.jsx";
import HeaderLinks from "./HeaderLinks.jsx";
import LeftHeaderLinks from "./LeftHeaderLinks";
import SignInModal from "./SignInModal";
import Web3 from "web3";
import assist from "bnc-assist";
import {signOnUser} from "utils";
import {bn_id} from "constants.js";

class Header extends React.Component {
    state = {
        mobileOpen: false,
        signInModal: false,
        web3: null,
        assistInstance: null
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
        this.setState({web3: new Web3(window.web3.currentProvider)}, () => {
            const bncAssistConfig = {
                dappId: bn_id,
                networkId: 4,
                web3: this.state.web3
            };
            this.setState({assistInstance: assist.init(bncAssistConfig)}, () => {
                signOnUser(this.state.assistInstance, this.state.web3).then(() => {
                    this.closeModal("signInModal");
                    window.location.reload();
                });
            });
        });
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

    render = () => {
        const {
            classes,
            color,
            rightLinks,
            leftLinks,
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
                                <LeftHeaderLinks/>
                            </Hidden>
                        </div>
                        <Hidden smDown implementation="css">
                            <HeaderLinks commenceSignIn={this.commenceSignIn}/>
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
                            <LeftHeaderLinks/>
                            <HeaderLinks commenceSignIn={this.commenceSignIn}/>
                        </div>
                    </Drawer>
                </Hidden>
                <MenuAppBar/>
                <SignInModal
                    openState={this.state.signInModal}
                    closeModal={this.closeModal}
                />
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
