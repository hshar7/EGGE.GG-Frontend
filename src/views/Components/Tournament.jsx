import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from "axios";
import Header from "components/Header/Header.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
// sections for this page

import HeaderLinks from "components/Header/HeaderLinks.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import LeftHeaderLinks from "components/Header/LeftHeaderLinks.jsx";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import Card from "components/Card/Card";
import Bracket from './Bracket';
import './App.css';
import Button from "components/CustomButtons/Button";


class Tournament extends React.Component {

    state = {
        tournament: null,
        maxPlayers: 0,
        participants: [],
        matches: {}
    };

    componentWillMount() {
        axios.get("http://localhost:8080/api/tournament/" + this.props.match.params.id).then(response => {
            this.setState({...this.state.tournament, tournament: response.data});
            this.setState({maxPlayers: response.data.maxPlayers});
            this.setState({...this.state.participants, participants: response.data.participants});
            this.setState({...this.state.matches, matches: response.data.matches});
        })
    }

    render() {
        const {classes, ...rest} = this.props;
        console.log(this.state.tournament);


        let bracketElements = [];
        let matches = [];
        let bracket = 1;
        let matchCount = Object.keys(this.state.matches).length;
        let count = 0;
        Object.entries(this.state.matches).forEach(([key, value]) => {
            let match = value.value;
            if (count > matchCount / 2) {
                bracketElements.push(
                    <Bracket matches={matches} className={"round round-" + bracket}/>
                );
                bracket++;
                matchCount = matchCount - count;
                count = 0;
                matches = [];
            }
            matches.push({
                player1: match.player1 ? match.player1.name : "TBD",
                player2: match.player2 ? match.player2.name : "TBD"
            });
            count++;
        });

        // Add in final match
        bracketElements.push(
            <Bracket matches={matches} className={"round round-" + bracket}/>
        );
        return (
            <div>
                <Header
                    brand={<img src={require("assets/img/logo.svg")} alt={"egge.gg"}/>}
                    rightLinks={<HeaderLinks/>}
                    leftLinks={<LeftHeaderLinks/>}
                    fixed
                    color="white"
                    changeColorOnScroll={{
                        height: 400,
                        color: "white"
                    }}
                    {...rest}
                />
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <GridContainer spacing={24}>
                    <GridItem xs={10}>
                        <Card>
                            <h1>{this.state.tournament ? this.state.tournament.name : ""}</h1>
                            <h4>By {this.state.tournament && this.state.tournament.owner.organization ? this.state.tournament.owner.organization : ""}</h4>
                        </Card>
                    </GridItem>
                    <GridItem xs={2}>
                        <Card>
                            <Button color="danger"
                            >
                                Register +
                            </Button>
                            <Button color="success"
                            >
                                Contact Organizer
                            </Button>
                        </Card>
                    </GridItem>
                    <GridItem xs={6} sm={3}>
                        <Card>
                            <CardHeader color="danger" className={classes.cardHeader}>
                                Description
                            </CardHeader>
                            <CardBody>
                                <h3>{this.state.tournament ? this.state.tournament.description : ""}</h3>
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem xs={6} sm={3}>
                        <Card>
                            <CardHeader color="danger" className={classes.cardHeader}>
                                Game
                            </CardHeader>
                            <CardBody>
                                <h3>{this.state.tournament ? this.state.tournament.game.name : ""}</h3>
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem xs={6} sm={3}>
                        <Card>
                            <CardHeader color="danger" className={classes.cardHeader}>
                                Participants
                            </CardHeader>
                            <CardBody>
                                <h3>{this.state.participants ? this.state.participants.length : ""} / {this.state.maxPlayers ? this.state.maxPlayers : ""}</h3>
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem xs={6} sm={3}>
                        <Card>
                            <CardHeader color="danger" className={classes.cardHeader}>
                                Prize
                            </CardHeader>
                            <CardBody>
                                <h3>{this.state.tournament ? this.state.tournament.prize : ""} ETH</h3>
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
                <br/>
                <br/>
                {this.state.tournament && this.state.participants.length >= this.state.maxPlayers ?
                <Card>
                    <CardHeader color="danger" className={classes.cardHeader}>
                        Bracket
                    </CardHeader>
                    <CardBody>
                        <main id="tournament">
                            {bracketElements}
                        </main>
                    </CardBody>
                </Card>
                    : null}
            </div>
        );
    }
}

export default withStyles(componentsStyle)(Tournament);
