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
import {Redirect} from "react-router-dom";
import Web3 from "web3";
import assist from "bnc-assist";

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
        decoratedContract: null
    };

    componentWillMount() {
        axios.get("http://localhost:8080/api/tournament/" + this.props.match.params.id).then(response => {
            this.setState({...this.state.tournament, tournament: response.data});
            this.setState({maxPlayers: response.data.maxPlayers});
            this.setState({...this.state.participants, participants: response.data.participants});
            this.setState({...this.state.matches, matches: response.data.matches});
        });


        this.setState({web3: new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/ca86eb9dcddc4f85b7a3046c6f6b7b62"))});
        let bncAssistConfig = {
            dappId: 'cae96417-0f06-4935-864d-2d5f99e7d40f',
            networkId: 4,
            web3: this.state.web3
        };
        this.setState({assistInstance: assist.init(bncAssistConfig)});
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirectPath}/>
        }
    };

    handleUserRegister = () => {
        this.state.assistInstance.onboard()
            .then(() => {
                this.state.web3.setProvider(window.web3.currentProvider);
                this.state.assistInstance.getState().then(state => {
                    axios.post('http://localhost:8080/api/user', {
                        accountAddress: state.accountAddress
                    }).then(response => {
                        this.setState({...this.state.user, user: response.data});
                        if (isEmpty(response.data.name) || isEmpty(response.data.organization) || isEmpty(response.data.email)) {
                            this.setState({redirectPath: "/editUser"});
                            this.setState({redirect: true});
                        } else {
                            // Actually register here
                            axios.post('http://localhost:8080/api/tournament/' + this.state.tournament.id + '/participant/' + this.state.user.id).then(() => {
                                window.location.reload()
                            });
                        }
                    })
                })
            }).catch(error => {
            console.log('error');
            console.log(error);
        });
    };

    winner1 = (matchId) => {
        axios.post("http://localhost:8080/api/match/" + matchId + "/winner/1")
            .then(() => {
                window.location.reload();
            })
    };

    winner2 = (matchId) => {
        axios.post("http://localhost:8080/api/match/" + matchId + "/winner/2")
            .then(() => {
                window.location.reload();
            })
    };

    finalWinner1 = (matchId) => {
        axios.post("http://localhost:8080/api/match/" + matchId + "/winner/1")
            .then(() => {
                this.handlePayment()
            })
    };

    finalWinner2 = (matchId) => {
        axios.post("http://localhost:8080/api/match/" + matchId + "/winner/2")
            .then(() => {
                this.handlePayment()
            })
    };

    handlePayment = () => {

        let abi = [{
            "constant": true,
            "inputs": [],
            "name": "tournamentOrganizer",
            "outputs": [{"name": "", "type": "address"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "_fistPlace", "type": "address"}, {"name": "_secondPlace", "type": "address"}],
            "name": "payOutWinners",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "withdrawFunds",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "cancelTournament",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "winnersPot",
            "outputs": [{"name": "", "type": "uint256"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "isFunded",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "currentFunds",
            "outputs": [{"name": "", "type": "uint256"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "state",
            "outputs": [{"name": "", "type": "uint8"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "fundTournamant",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        }, {
            "inputs": [{"name": "_tournamentOrganizer", "type": "address"}, {"name": "_winnersPot", "type": "uint256"}],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        }, {"payable": false, "stateMutability": "nonpayable", "type": "fallback"}];

        this.setState({contract: new this.state.web3.eth.Contract(abi, this.state.tournament.contractHash)},
            () => {
                const bncAssistConfig = {
                    dappId: 'cae96417-0f06-4935-864d-2d5f99e7d40f',
                    networkId: 4,
                    web3: this.state.web3
                };
                this.setState({assistInstance: assist.init(bncAssistConfig)},
                    () => {
                        this.state.assistInstance.getState()
                            .then(function (state) {
                                console.log(state)
                            });
                        this.setState({decoratedContract: this.state.assistInstance.Contract(this.state.contract)},
                            () => {
                                console.log(this.state.decoratedContract);

                                this.state.web3.eth.getAccounts((err, accs) => {
                                    if (err) {
                                        console.log('error fetching accounts', err);
                                    } else {
                                        if (accs.length === 0) {
                                            this.setState({
                                                modalError: "Please unlock your MetaMask Accounts",
                                                modalOpen: true
                                            });
                                        } else {
                                            let account = accs[0];
                                            setInterval(() => {
                                                this.state.web3.eth.getAccounts((err, accs) => {
                                                    if (accs[0] !== account) {
                                                        account = this.state.web3.eth.accounts[0];
                                                        window.location.reload();
                                                    }
                                                });
                                            }, 2000);
                                        }
                                    }
                                });
                                let finalMatch = this.state.matches[Object.keys(this.state.matches).length - 1];
                                let firstPlaceAddress = finalMatch.winner.publicAddress;
                                let secondPlaceAddress = null;

                                if (finalMatch.winner.id === finalMatch.player1.id) {
                                    secondPlaceAddress = finalMatch.player2.publicAddress;
                                } else {
                                    secondPlaceAddress = finalMatch.player1.publicAddress;
                                }
                                this.state.decoratedContract.methods.payOutWinners(firstPlaceAddress, secondPlaceAddress).send({from: this.state.user.publicAddress})
                                    .on('transactionHash', (hash) => {
                                        this.setState({deployedContractHash: hash});
                                    })
                                    .on('receipt', (receipt) => {
                                        console.log("done!");
                                    })
                                    .on('confirmation', (confirmationNumber, receipt) => {
                                    })
                                    .on('error', console.error);
                            })
                    });
            }
        );
    };

    render() {
        const {classes, ...rest} = this.props;

        let bracketElements = [];
        let matches = [];
        let bracket = 1;
        let matchCount = Object.keys(this.state.matches).length;
        let count = 0;
        Object.entries(this.state.matches).forEach(([key, value]) => {
            let match = value.value;
            if (count > matchCount / 2) {
                bracketElements.push(
                    <Bracket winner1={(match) => this.winner1(match)} winner2={(match) => this.winner2(match)} matches={matches}
                             className={"round round-" + bracket}/>
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
                matchId: match.id
            });
            count++;
        });

        // Add in final match
        bracketElements.push(
            <Bracket winner1={(match) => this.finalWinner1(match)} winner2={(match) => this.finalWinner2(match)} matches={matches}
                     className={"round round-" + bracket}/>
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
                            <Button color="danger" onClick={() => this.handleUserRegister()}
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
                {this.renderRedirect()}
            </div>
        );
    }
}

export default withStyles(componentsStyle)(Tournament);
