import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from "axios";
import Header from "components/Header/Header.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import LeftHeaderLinks from "components/Header/LeftHeaderLinks.jsx";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import Card from "components/Card/Card";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import Bracket from './Bracket';
import './App.css';
import Button from "components/CustomButtons/Button";
import { Redirect } from "react-router-dom";
import Web3 from "web3";
import assist from "bnc-assist";
import { base, web3_node } from "../../constants";
import abi from '../../abis/tournamentAbi';

function isEmpty(str) {
    return (!str || 0 === str.length);
}

class Tournament extends React.Component {

    state = {
        tournament: null,
        maxPlayers: 0,
        participants: [],
        matches: {},
        redirect: false,
        redirectPath: "",
        user: null,
        web3: null,
        assistInstance: null,
        contract: null,
        decoratedContract: null,
        tokenPrice: 0,
        tokenName: "ETH",
        tokenVersion: 0,
        contribution: 0
    };

    handleSimple = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    componentDidMount() {
        axios.get(`${base}/tournament/` + this.props.match.params.id).then(response => {
            this.setState({ ...this.state.tournament, tournament: response.data });
            this.setState({ tokenPrice: response.data.tokenPrice });
            this.setState({ tokenName: response.data.tokenName });
            this.setState({ tokenVersion: response.data.tokenVersion });
            this.setState({ maxPlayers: response.data.maxPlayers });
            this.setState({ ...this.state.participants, participants: response.data.participants });
            this.setState({ ...this.state.matches, matches: response.data.matches });
        });
        this.setState({ web3: new Web3(window.web3.currentProvider) }, () => {
            let bncAssistConfig = {
                dappId: 'cae96417-0f06-4935-864d-2d5f99e7d40f',
                networkId: 4,
                web3: this.state.web3
            };
            this.setState({ assistInstance: assist.init(bncAssistConfig) });
        });
    }

    onboardUser = (resolve, reject) => {
        this.state.assistInstance.onboard().then(() => {
            this.state.assistInstance.getState().then(state => {
                axios.post(`${base}/user`, {
                    accountAddress: state.accountAddress
                }).then(response => {
                    if (isEmpty(response.data.name) || isEmpty(response.data.organization) || isEmpty(response.data.email)) {
                        this.setState({ redirectPath: "/editUser" });
                        this.setState({ redirect: true });
                    } else {
                        this.setState({ ...this.state.user, user: response.data });
                        resolve();
                    }
                })
            })
        }).catch(e => { console.log({ e }) && reject(e); });
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirectPath} />
        }
    };

    handleUserRegister = () => {
        // this.state.assistInstance.onboard().then(() => {
        //     this.state.assistInstance.getState().then(state => {
        //         axios.post(`${base}/user`, {
        //             accountAddress: state.accountAddress
        //         }).then(response => {
        //             this.setState({ ...this.state.user, user: response.data });
        //             if (isEmpty(response.data.name) || isEmpty(response.data.organization) || isEmpty(response.data.email)) {
        //                 this.setState({ redirectPath: "/editUser" });
        //                 this.setState({ redirect: true });
        //             } else {
        //                 // Actually register here
        //                 axios.post(`${base}/tournament/${this.state.tournament.id}/participant/${this.state.user.id}`).then(() => {
        //                     window.location.reload()
        //                 });
        //             }
        //         })
        //     })
        // }).catch(error => { console.log({ error }) });
    };

    // selectWinner = (matchId, num) => {
    //     axios.post(`${base}/match/${matchId}/winner/${num}`)
    //         .then(() => {
    //             window.location.reload();
    //         })
    // };

    // selectFinalWinner = (matchId, num) => {
    //     let matches = this.state.matches;
    //     matches[Object.keys(this.state.matches).length - 1].value.winner = matches[Object.keys(this.state.matches).length - 1].value.player1;
    //     this.setState({ matches: matches }, () => {
    //         console.log(this.state.matches);
    //         this.handlePayment(num);
    //     });
    // };

    handlePayment = (winner) => {
        // let promise = new Promise(this.onboardUser);
        // promise.then(() => {
        //     this.setState({ contract: new this.state.web3.eth.contract(abi, this.state.tournament.contractAddress) },
        //         () => {
        //             this.setState({ decoratedContract: this.state.assistInstance.Contract(this.state.contract) },
        //                 () => {

        //                     let finalMatch = this.state.matches[Object.keys(this.state.matches).length - 1];
        //                     let firstPlaceAddress = finalMatch.value.winner.publicAddress;
        //                     let secondPlaceAddress = null;

        //                     if (finalMatch.value.winner.id === finalMatch.value.player1.id) {
        //                         secondPlaceAddress = finalMatch.value.player2.publicAddress;
        //                     } else {
        //                         secondPlaceAddress = finalMatch.value.player1.publicAddress;
        //                     }

        //                     this.state.decoratedContract.methods.payOutWinners(firstPlaceAddress, secondPlaceAddress).send({ from: this.state.user.publicAddress })
        //                         .on('transactionHash', (hash) => {
        //                             axios.post(`${base}/match/${finalMatch.value.id}/winner/${winner}`)
        //                         })
        //                         .on('error', console.error);
        //                 })
        //         });
        // });
    };

    handleFunding = () => {
        let promise = new Promise(this.onboardUser);
        promise.then(() => {
            this.setState({ contract: this.state.web3.eth.contract(abi).at("0x056f0378db3cf4908a042c9a841ec792998bb3b4") },
                () => {
                    this.setState({ decoratedContract: this.state.assistInstance.Contract(this.state.contract) },
                        () => {
                            if (this.state.tokenVersion === 0) {
                                this.state.decoratedContract.contribute.sendTransaction(this.state.tournament.tournamentId, this.state.web3.toWei(this.state.contribution, 'ether'), {
                                    from: this.state.user.publicAddress,
                                    value: this.state.web3.toWei(this.state.contribution, 'ether')
                                }, (err, result) => {
                                    if (!err) {
                                        window.location.reload();
                                    }
                                });
                            } else {
                                window.alert("Working on it!");
                            }
                        })
                });
        });
    }

    render() {
        const { classes, ...rest } = this.props;

        let bracketElements = [];
        let matches = [];
        let bracket = 1;
        let matchCount = Object.keys(this.state.matches).length;
        let count = 0;
        Object.entries(this.state.matches).forEach(([key, value]) => {
            let match = value.value;
            if (count > matchCount / 2) {
                bracketElements.push(
                    <Bracket key={bracket} winner1={(matchId) => this.winner1(matchId)}
                        winner2={(match) => this.winner2(match)} matches={matches}
                        className={"round round-" + bracket} />
                );
                bracket++;
                matchCount = matchCount - count;
                count = 0;
                matches = [];
            }
            matches.push({
                player1: match.player1 ? match.player1.name : "TBD",
                player2: match.player2 ? match.player2.name : "TBD",
                winner: match.winner ? match.winner : null,
                matchId: match.id,
                matchKey: key
            });
            count++;
        });

        // Add in final match
        bracketElements.push(
            <Bracket key={bracket} winner1={(matchId) => this.finalWinner1(matchId)}
                winner2={(matchId) => this.finalWinner2(matchId)} matches={matches}
                className={"round round-" + bracket} />
        );
        return (
            <div>
                <Header
                    username={this.state.user ? this.state.user.name : 'Sign Up'}
                    brand={<img src={require("assets/img/logo.svg")} alt={"egge.gg"} />}
                    rightLinks={<HeaderLinks />}
                    leftLinks={<LeftHeaderLinks />}
                    fixed
                    color="white"
                    changeColorOnScroll={{
                        height: 400,
                        color: "white"
                    }}
                    {...rest}
                />
                <br />
                <br />
                <br />
                <br />
                <GridContainer xs={12}>
                    <GridItem xs={10}>
                        <Card>
                            <h1>{this.state.tournament ? this.state.tournament.name : ""}</h1>
                            <h4>By {this.state.tournament && this.state.tournament.owner.organization ? this.state.tournament.owner.organization : ""}</h4>
                        </Card>
                    </GridItem>
                    <GridItem xs={2}>
                        <Card>
                            <Button color="danger" onClick={() => this.handleUserRegister()}
                            >
                                Register
                            </Button>
                        </Card>
                        <Card>
                            <CustomInput
                                inputProps={{
                                    name: 'contribution',
                                    type: "number",
                                    onChange: this.handleSimple,
                                    required: true,
                                    startAdornment: <InputAdornment position="start">{this.state.tokenName}</InputAdornment>
                                }}
                            />
                            <Button color="success" onClick={() => this.handleFunding()}
                            >
                                Contribute
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
                                <h3>1st: {this.state.tournament ? (this.state.tournament.prize - this.state.tournament.prize * 0.3) : ""} {this.state.tokenName} </h3>
                            </CardBody>
                            <CardBody>
                                <h3>2nd: {this.state.tournament ? (this.state.tournament.prize - this.state.tournament.prize * 0.7) : ""} {this.state.tokenName} </h3>
                            </CardBody>
                            <hr />
                            <CardBody>
                                1 {this.state.tokenName} = ${this.state.tokenPrice}
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
                <br />
                <br />
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
                {this.renderRedirect()}
            </div>
        );
    }
}

export default withStyles(componentsStyle)(Tournament);
