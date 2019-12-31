import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import FeaturedTournaments from "./FeaturedTournaments.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CurrentTournaments from "./CurrentTournaments.jsx";
import HelloWelcomeModal from "./HelloWelcomeModal";

class LandingPage extends React.Component {
    state = {
        helloWelcomeModal: false
    };

    componentDidMount = () => {
        // if (!localStorage.getItem("helloWelcomeModal")) {
        //     this.setState({helloWelcomeModal: true});
        // }
    };

    handleRedirect = path => {
        this.props.history.push(path);
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
        return (
            <div style={{overflow: "hidden"}}>
                <GridContainer className={classes.mainContainer} justify="center">
                    <GridItem xs={0} md={12} lg={12} xl={12}>
                        <FeaturedTournaments handleRedirect={this.handleRedirect}/>
                    </GridItem>
                    <GridItem xs={12} md={12}>
                        <Card className={classes.main} plain={true} style={{marginLeft: "10rem", marginTop: "2rem"}}>
                            <h1 style={{fontWeight: "bold", color: "#ff7932"}}>Current Tournaments</h1>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} md={8} lg={8} xl={8}>
                        <Card className={classes.main} plain={true}>
                            <CurrentTournaments handleRedirect={this.handleRedirect}/>
                        </Card>
                    </GridItem>
                </GridContainer>
                <HelloWelcomeModal openState={this.state.helloWelcomeModal} closeModal={this.handleModalClose}/>
            </div>
        );
    }
}

export default withStyles(componentsStyle)(LandingPage);
