/*eslint-disable*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
import {withStyles} from "@material-ui/core";
import footerStyle from "assets/jss/material-kit-react/components/footerStyle.jsx";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";

function Footer({...props}) {
    const {classes, whiteFont} = props;
    const footerClasses = classNames({
        [classes.footer]: true,
        [classes.footerWhiteFont]: whiteFont
    });
    const aClasses = classNames({
        [classes.a]: true,
        [classes.footerWhiteFont]: whiteFont
    });
    return (
        <footer className={footerClasses}>
            <GridContainer justify="center">
                <GridItem xs={0} md={3}/>
                <GridItem xs={12} md={3} className={classes.links}>
                    <div className={classes.block} >
                        <a href="mailto:play@playnacl.com" className={classes.block} target="_blank">
                            Contact
                        </a>
                    </div>
                    <div className={classes.block} >
                        <a href="https://www.playnacl.com/about-us" className={classes.block}  target="_blank">
                            About NACL
                        </a>
                    </div>
                    <div className={classes.block} >
                        <a href="https://www.consensys.net/about" className={classes.block} target="_blank">
                            About Consensys
                        </a>
                    </div>
                    <div className={classes.block} >
                        <a href="https://consensys.net/enterprise-ethereum/use-cases/sports-and-esports/" className={classes.block} target="_blank">
                            Ethereum & Esports
                        </a>
                    </div>
                </GridItem>
                <GridItem xs={12} md={3}>
                    NACL &copy; {1900 + new Date().getYear()} <br/> Developed by Consensys
                </GridItem>
                <GridItem xs={0} md={3}/>
            </GridContainer>
        </footer>
    );
}

Footer.propTypes = {
    classes: PropTypes.object.isRequired,
    whiteFont: PropTypes.bool
};

export default withStyles(footerStyle)(Footer);
