import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";
import ProductSection from "./Sections/ProductSection.jsx";
import TeamSection from "./Sections/TeamSection.jsx";
import WorkSection from "./Sections/WorkSection.jsx";

class LandingPage extends React.Component {
    render() {
        const {classes, history} = this.props;
        return (
            <div>
                <Parallax filter image={require("assets/img/paralax.jpg")}>
                    <div className={classes.container}>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={6}>
                                <h1 className={classes.title}>Next Level Esports Tournaments</h1>
                                <h4>
                                    EggE.gg empowers Esports tournament organizers to automate and better
                                    organize events from payments to score reporting, and anything in between.
                                    Whether it&#39;s for DOTA, Super Smash Bros, or any other game,
                                    EggE.gg lets you create tournaments, organize, and manage prizes all on one
                                    platform.
                                </h4>
                                <br/>
                                <Button
                                    color="danger"
                                    size="lg"
                                    onClick={() => history.push("/explore")}
                                    rel="noopener noreferrer"
                                >
                                    <i className="fas"/>
                                    Explore
                                </Button>
                            </GridItem>
                        </GridContainer>
                    </div>
                </Parallax>
                <div className={classNames(classes.main, classes.mainRaised)}>
                    <div className={classes.container}>
                        <ProductSection/>
                        <TeamSection />
                        <WorkSection/>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

LandingPage.propTypes = {
    classes: PropTypes.object
};

export default withStyles(landingPageStyle)(LandingPage);
