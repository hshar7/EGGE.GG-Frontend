import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import FeaturedTournaments from "./FeaturedTournaments.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import Footer from "../../components/Footer/Footer";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CurrentTournaments from "./CurrentTournaments.jsx";
import {Redirect} from "react-router-dom";
import HelloWelcomeModal from "./HelloWelcomeModal";

class LandingPage extends React.Component {
    state = {
        redirect: false,
        redirectPath: "",
        helloWelcomeModal: false
    };

    componentDidMount = () => {
        if (!localStorage.getItem("helloWelcomeModal")) {
            this.setState({helloWelcomeModal: true});
        }
    };

    handleRedirect = path => {
        this.setState({redirectPath: path});
        this.setState({redirect: true});
    };

    handleModalClose = modal => {
        if (modal === "helloWelcomeModal") {
            localStorage.setItem("helloWelcomeModal", "false");
        }
        const x = [];
        x[modal] = false;
        this.setState(x);
    };

    render() {
        const {classes} = this.props;
        if (this.state.redirect === true) {
            return <Redirect to={this.state.redirectPath}/>;
        }
        return (
            <div style={{overflow: "hidden"}}>
                <GridContainer className={classes.mainContainer}>
                    <FeaturedTournaments handleRedirect={this.handleRedirect}/>
                    <GridItem xs={12}>
                        <Card className={classes.main}>
                            <CurrentTournaments handleRedirect={this.handleRedirect}/>
                        </Card>
                    </GridItem>
                </GridContainer>
                <Footer/>
                <HelloWelcomeModal openState={this.state.helloWelcomeModal} closeModal={this.handleModalClose}/>
            </div>
        );
    }
}

export default withStyles(componentsStyle)(LandingPage);
