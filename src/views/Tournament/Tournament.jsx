import React from "react";
import Web3 from "web3";
import assist from "bnc-assist";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card";
import Button from "components/CustomButtons/Button";
import {withStyles, CardMedia} from "@material-ui/core";
import Pills from "./Pills.jsx";
import abi from "abis/tournamentAbi";
import humanStandardTokenAbi from "abis/humanStandardToken";
import {bn_id, contract_address, base} from "constants.js";
import {prepUserForContract, sleep, apolloClient} from "utils";
import {PICK_WINNER, ADD_PARTICIPANT, GET_TOURNAMENT, ROUND_UPDATE, START_TOURNAMENT} from "./graphs";
import "../Components/App.css"; // TODO: Make sure it's safe to delete this.
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import PrizesModal from "./modals/PrizesModal";
import ContestantsModal from "./modals/ContestantsModal";
import ContributeModal from "./modals/ContributeModal";
import ParticipateModal from "./modals/ParticipateModal";
import SelectWinnerModal from "./modals/SelectWinnerModal";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import BattleRoyale from "./BattleRoyale";

const $ = (window.jQuery = require("jquery"));
require("../../../node_modules/jquery-bracket/dist/jquery.bracket.min.js");
require("../../../node_modules/jquery-bracket/dist/jquery.bracket.min.css");

class Tournament extends React.Component {
    state = {
        id: null,
        tournament: {},
        maxPlayers: 0,
        participants: [],
        matches: [],
        user: {},
        owner: {},
        web3: null,
        assistInstance: null,
        contract: null,
        decoratedContract: null,
        tokenName: "ETH",
        tokenVersion: 0,
        contribution: 0,
        tokenUsdPrice: 0,
        prize: 0,
        deadline: 0,
        title: "",
        prizesModal: false,
        contestantsModal: false,
        contributeModal: false,
        participateModal: false,
        selectWinnerModal: false,
        match: {},
        coverImage: ""
    };

    handleModalClickOpen = modal => {
        var x = [];
        x[modal] = true;
        this.setState(x);
    };

    handleModalClose = modal => {
        var x = [];
        x[modal] = false;
        this.setState(x);
    };

    handleMatchClick = match => {
        if (localStorage.getItem("userId") === this.state.tournament.owner.id) {
            this.setState({match: match});
            this.handleModalClickOpen("selectWinnerModal");
        }
    };

    handleFiles = e => {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        axios
            .post(`${base}/api/tournament/${this.state.id}/coverImage`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then(response => {
                sleep(3000).then(() => {
                    this.setState({coverImage: response.data.fileUrl});
                });
            });
    };

    componentDidMount = () => {
        this.setState({id: this.props.match.params.id});
        this.getTournament(this.props.match.params.id);
        if (window.web3) {
            this.setState({web3: new Web3(window.web3.currentProvider)}, () => {
                    let bncAssistConfig = {
                        dappId: bn_id,
                        networkId: 4,
                        web3: this.state.web3,
                        messages: {
                            txPending: data => {
                                if (data.contract.methodName === "approve") {
                                    return "Approving funds to be contributed.";
                                } else {
                                    return "Transaction Pending";
                                }
                            },
                            txConfirmed: data => {
                                if (data.contract.methodName === "approve") {
                                    this.setState(
                                        {
                                            decoratedContract: this.state.assistInstance.Contract(
                                                this.state.web3.eth.contract(abi).at(contract_address)
                                            )
                                        },
                                        () => {
                                            this.state.decoratedContract.contribute(
                                                this.state.tournament.tournamentId,
                                                this.state.contribution,
                                                {
                                                    from: this.state.user.publicAddress
                                                },
                                                (err) => {
                                                    if (!err) {
                                                        window.location.reload();
                                                    }
                                                }
                                            );
                                        }
                                    );
                                    return `${this.state.contribution} ${
                                        this.state.tokenName
                                    } approved.`;
                                } else if (data.contract.methodName === "contribute") {
                                    sleep(5000).then(() => {
                                        window.location.reload();
                                        return "Contribution successful.";
                                    });
                                } else if (data.contract.methodName === "payoutWinners") {
                                    sleep(10000).then(() => {
                                        this.getTournament(this.props.match.params.id);
                                        return "Winners successfully paid.";
                                    });
                                } else {
                                    return "Transaction Confirmed";
                                }
                            }
                        },
                        style: {
                            darkMode: true
                        }
                    };
                    this.setState({assistInstance: assist.init(bncAssistConfig)}, () => {
                        if (localStorage.getItem("jwtToken")) {
                            prepUserForContract(this.state.assistInstance, this.props.history).then(
                                responseData => {
                                    this.setState({...this.state.user, user: responseData});
                                }
                            );
                        }
                    });
                }
            );
        }
    };

    getTournament = id => {
        apolloClient
            .query({
                query: GET_TOURNAMENT(id)
            })
            .then(response => {
                if (response.loading) return "Loading...";
                if (response.error) return `Error!`;
                const data = response.data;
                this.setState({
                    ...this.state.tournament,
                    tournament: data.tournament
                });
                this.setState({tokenName: data.tournament.token.symbol});
                this.setState({tokenVersion: data.tournament.token.tokenVersion});
                this.setState({coverImage: data.tournament.coverImage});
                this.setState({owner: data.tournament.owner});
                this.setState({maxPlayers: data.tournament.maxPlayers});
                this.setState({title: data.tournament.name});
                this.setState({
                    ...this.state.participants,
                    participants: data.tournament.participants
                });
                this.setState({
                    ...this.state.matches,
                    matches: data.tournament.matches
                });
                this.setState({tokenUsdPrice: data.tournament.token.usdPrice});
                this.setState({prize: data.tournament.prize});
                this.setState({deadline: data.tournament.deadline});
                this.setState({tournamentType: data.tournament.tournamentType});
                return null;
            });
    };

    handleUserRegister = (tournamentId, userId) => {
        prepUserForContract(this.state.assistInstance, this.props.history).then(
            responseData => {
                this.setState({...this.state.user, user: responseData});
                apolloClient
                    .mutate({
                        variables: {tournamentId: tournamentId, userId: userId},
                        mutation: ADD_PARTICIPANT
                    })
                    .then(response => {
                        if (response.loading) return "Loading...";
                        if (response.error) return `Error!`;

                        const tournament = response.data.addParticipant;
                        this.setState({
                            ...this.state.tournament,
                            tournament: tournament
                        });
                        this.setState({
                            ...this.state.participants,
                            participants: tournament.participants
                        });
                        this.setState({
                            ...this.state.matches,
                            matches: tournament.matches
                        });
                        return null;
                    });
            }
        );
    };

    handleStartTournament = () => {
        apolloClient.mutate({
            variables: {tournamentId: this.state.tournament.id},
            mutation: START_TOURNAMENT
        }).then(response => {
            this.setState({tournament: response.data.startTournament});
        });
    };

    handlePointUpdate = event => {
        const round = event.target.name.split(",")[0];
        const userId = event.target.name.split(",")[1];
        const tournament = this.state.tournament;
        tournament.rounds[round][userId] = parseInt(event.target.value);
        this.setState({tournament: tournament});
        console.log(tournament);
    };

    endRound = roundNumber => {
        apolloClient.mutate({
            variables: {
                tournamentId: this.state.tournament.id,
                roundNumber,
                standings: this.state.tournament.rounds[roundNumber]
            },
            mutation: ROUND_UPDATE
        }).then(response => {
            this.setState({tournament: response.data.roundUpdate});
        });
    };

    handleWinner = (matchId, num) => {
        prepUserForContract(this.state.assistInstance, this.props.history).then(
            responseData => {
                this.setState({...this.state.user, user: responseData});
                const finalMatch = this.state.matches[this.state.matches.length - 1];
                if (finalMatch.id === matchId) {
                    this.handlePayment(num);
                } else {
                    apolloClient
                        .mutate({
                            variables: {pos: Number(num), matchId: matchId},
                            mutation: PICK_WINNER
                        })
                        .then(response => {
                            this.setState({
                                ...this.state.matches,
                                matches: response.data.matchWinner
                            });
                        });
                }
            }
        );
    };

    handleSimple = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handlePayment = winner => {
        this.setState(
            {
                decoratedContract: this.state.assistInstance.Contract(
                    this.state.web3.eth.contract(abi).at(contract_address)
                )
            },
            () => {
                let winners = [];
                let finalMatch = this.state.matches[Object.keys(this.state.matches).length - 1];

                if (winner === 1) {
                    winners.push(finalMatch.player1.publicAddress);
                    winners.push(finalMatch.player2.publicAddress);
                } else {
                    winners.push(finalMatch.player2.publicAddress);
                    winners.push(finalMatch.player1.publicAddress);
                }

                // This is for single elimination only
                for (let i = 0; i < this.state.tournament.maxPlayers - 2; i++) {
                    winners.push(this.state.user.publicAddress);
                }
                this.state.decoratedContract.payoutWinners(
                    this.state.tournament.tournamentId,
                    winners,
                    {from: this.state.user.publicAddress},
                    (err) => {
                        if (!err) {
                            console.log("Contract successful");
                        }
                    }
                );
            }
        );
    };

    handlePaymentBR = () => {
        const winners = this.state.tournament.winners;
        for (let i = 0; i < this.state.tournament.maxPlayers; i++) {
            if (winners[i] === undefined) {
                winners[i] = this.state.user.publicAddress;
            }
        }

        this.setState(
            {
                decoratedContract: this.state.assistInstance.Contract(
                    this.state.web3.eth.contract(abi).at(contract_address)
                )
            },
            () => {
                this.state.decoratedContract.payoutWinners(
                    this.state.tournament.tournamentId,
                    this.state.tournament.winners,
                    {from: this.state.user.publicAddress},
                    (err) => {
                        if (!err) {
                            console.log("Contract successful");
                        }
                    }
                );
            }
        );
    };

    handleFunding = () => {

        if (this.state.tournamentType === "BUY_IN") {
            this.setState({contribution: this.state.tournament.buyInFee});
        }

        prepUserForContract(this.state.assistInstance, this.props.history).then(
            responseData => {
                this.setState({...this.state.user, user: responseData});
                if (this.state.tokenVersion === 20) {

                    // Fix up to BigNumber
                    let decimals = this.state.web3.toBigNumber(18); // TODO: Get this from token object
                    let amount = this.state.web3.toBigNumber(this.state.contribution);
                    let value = amount.times(this.state.web3.toBigNumber(10).pow(decimals));
                    this.setState({contribution: value});

                    this.setState(
                        {
                            decoratedContract: this.state.assistInstance.Contract(
                                this.state.web3.eth
                                    .contract(humanStandardTokenAbi)
                                    .at(this.state.tournament.token.address)
                            )
                        },
                        () => {
                            this.state.decoratedContract.approve(
                                contract_address,
                                this.state.contribution,
                                {from: this.state.user.publicAddress}
                            );
                        }
                    );
                } else if (this.state.tokenVersion === 0) {
                    this.setState(
                        {
                            decoratedContract: this.state.assistInstance.Contract(
                                this.state.web3.eth.contract(abi).at(contract_address)
                            )
                        },
                        () => {
                            this.state.decoratedContract.contribute.sendTransaction(
                                this.state.tournament.tournamentId,
                                this.state.web3.toWei(this.state.contribution, "ether"),
                                {
                                    from: this.state.user.publicAddress,
                                    value: this.state.web3.toWei(this.state.contribution, "ether"),
                                    gas: 200000
                                }
                            );
                        }
                    );
                } else {
                    window.alert("Working on it!");
                }
            });
    };

    render() {
        const {classes} = this.props;

        if (this.state.matches.length > 0) {
            const teams = [];
            this.state.matches.map((match, i) => {
                if (i < this.state.maxPlayers / 2) {
                    teams.push([match.player1.name, match.player2.name]);
                }
            });

            let matchCount = this.state.matches.length;
            let count = 0;
            let rounds = [];
            let round = [];
            this.state.matches.map((match) => {
                if (count > matchCount / 2) {
                    rounds.push(round);
                    matchCount = matchCount - count;
                    count = 0;
                    round = [];
                }
                if (match.winner) {
                    if (match.winner.id === match.player1.id) {
                        round.push([1, 0, match]);
                    } else {
                        round.push([0, 1, match]);
                    }
                } else {
                    round.push([null, null, match]);
                }
                count++;
            });

            // Add in final match
            let final = [];
            const finalMatch = this.state.matches[this.state.matches.length - 1];
            if (finalMatch.winner) {
                if (finalMatch.winner.id === finalMatch.player1.id) {
                    final.push([1, 0, finalMatch]);
                } else {
                    final.push([0, 1, finalMatch]);
                }
            } else {
                final.push([null, null, finalMatch]);
            }

            const results = [[...rounds, final]];
            const singleElimination = {
                teams: teams,
                results: results
            };

            $(
                $(this.brackets).bracket({
                    teamWidth: 100,
                    centerConnectors: true,
                    skipConsolationRound: true,
                    onMatchClick: this.handleMatchClick,
                    init: singleElimination
                })
            );
        }

        return (
            <div>
                <GridContainer justify="center">
                    <GridItem xs={12} md={8} lg={8} xl={8}>
                        <h1>{this.state.title}</h1>
                    </GridItem>
                    <GridItem xs={12} md={8} lg={8} xl={8}
                              style={{borderStyle: "solid", borderWidth: "0px 5px 0px 5px"}}>
                        <Pills
                            prize={this.state.prize}
                            tokenName={this.state.tokenName}
                            participants={this.state.participants.length}
                            tourType={this.state.tournament.tournamentType}
                            bracketType={this.state.tournament.bracketType}
                            tournamentFormat={this.state.tournament.tournamentFormat}
                            deadline={this.state.deadline}
                            handleModalClickOpen={this.handleModalClickOpen}
                        />
                    </GridItem>
                    <GridItem xs={12} md={8} lg={8} xl={8}
                              style={{borderStyle: "solid", borderWidth: "0px 5px 0px 5px"}}>
                        {this.state.tournamentType === "PRIZE_POOL" ?
                            <Button
                                style={{backgroundColor: "#ff7932", borderRadius: "0.5rem"}}
                                onClick={() => this.handleModalClickOpen("contributeModal")}
                            >
                                Contribute To Prize Pool
                            </Button>
                            : ""}
                        <Button
                            style={{backgroundColor: "#ff7932", borderRadius: "0.5rem"}}
                            onClick={() => this.handleModalClickOpen("participateModal")}
                            disabled={
                                this.state.participants.filter(x => x.id === this.state.user.id).length > 0 || this.state.tournament.tournamentStatus !== "NEW"
                            }
                        >
                            Join As A Contestant
                        </Button>
                        {this.state.tournament.owner && this.state.tournament.owner.id !== localStorage.getItem("userId") ?
                            <Button
                                style={{backgroundColor: "#ff7932", borderRadius: "0.5rem"}}
                            >
                                Contact organizer
                            </Button>
                            : this.state.tournament.tournamentStatus === "NEW" ? <Button
                                onClick={this.handleStartTournament}
                                style={{backgroundColor: "#ff7932", borderRadius: "0.5rem"}}
                            >
                                Start Tournament!
                            </Button> : <Button onClick={this.handlePaymentBR}
                                                style={{backgroundColor: "#ff7932", borderRadius: "0.5rem"}}
                                                disabled={this.state.tournament.tournamentStatus !== "FINISHED"}>
                                $ Issue Payments $
                            </Button>}
                    </GridItem>
                    <GridItem xs={12} md={8} lg={8} xl={8}
                              style={{borderStyle: "solid", borderWidth: "0px 5px 0px 5px"}}>
                        <Card
                            plain={true}
                            style={{marginTop: "0", position: "relative"}}
                        >
                            <CardMedia
                                image={this.state.coverImage}
                                style={{
                                    borderRadius: "0.5rem",
                                    paddingTop: "25%",
                                    minHeight: "10rem"
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: "20px",
                                    left: "15px",
                                    color: "white",
                                    backgroundColor: "transparent",
                                    fontSize: "x-large"
                                }}
                            >
                                {this.state.owner.id === localStorage.getItem("userId") ? (
                                    <div>
                                        <input
                                            accept="image/*"
                                            className={classes.input}
                                            style={{display: "none"}}
                                            id="raised-button-file"
                                            multiple
                                            onChange={this.handleFiles}
                                            type="file"
                                        />
                                        <label htmlFor="raised-button-file">
                                            <Button
                                                variant="raised"
                                                component="span"
                                                className={classes.button}
                                            >
                                                Change Cover
                                            </Button>
                                        </label>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} md={8} lg={8} xl={8}
                              style={{marginTop: "-2rem", borderStyle: "solid", borderWidth: "0px 5px 0px 5px"}}>
                        <Card plain={true}>
                            {this.state.tournament ?
                                <ReactMarkdown
                                    source={this.state.tournament.description}
                                    escapeHtml={true}
                                />
                                : ""}
                        </Card>
                    </GridItem>
                    <GridItem xs={12} md={8} lg={8} xl={8}
                              style={{borderStyle: "solid", borderWidth: "0px 5px 0px 5px"}}>
                        {this.state.tournament && this.state.tournament.bracketType === "SINGLE_ELIMINATION" &&
                        this.state.participants.length >= this.state.maxPlayers ? (
                            <Card>
                                <div ref={node => this.brackets = node} className="App"/>
                            </Card>
                        ) : null}
                    </GridItem>
                    <GridItem xs={12} md={8} lg={8} xl={8}
                              style={{borderStyle: "solid", borderWidth: "0px 5px 0px 5px"}}>
                        {this.state.tournament && this.state.tournament.bracketType === "BATTLE_ROYALE" &&
                        this.state.tournament.tournamentStatus !== "NEW" ?
                            <BattleRoyale handlePointUpdate={this.handlePointUpdate}
                                          maxPlayers={this.state.tournament.maxPlayers}
                                          organizer={this.state.tournament.owner.id === localStorage.getItem("userId")}
                                          rounds={this.state.tournament.rounds}
                                          participants={this.state.tournament.participants}
                                          endRound={this.endRound}
                                          pointsToWin={this.state.tournament.pointsToWin}
                                          live={this.state.tournament.tournamentStatus === "LIVE"}
                            /> : null}
                    </GridItem>
                </GridContainer>
                <PrizesModal
                    openState={this.state.prizesModal}
                    closeModal={this.handleModalClose}
                    tournament={this.state.tournament}
                />
                <ContestantsModal
                    openState={this.state.contestantsModal}
                    closeModal={this.handleModalClose}
                    participants={this.state.participants}
                    maxPlayers={this.state.maxPlayers}
                />
                <ContributeModal
                    openState={this.state.contributeModal}
                    closeModal={this.handleModalClose}
                    tokenName={this.state.tokenName}
                    handleSimple={this.handleSimple}
                    handleFunding={this.handleFunding}
                />
                <ParticipateModal
                    openState={this.state.participateModal}
                    closeModal={this.handleModalClose}
                    tournamentId={this.state.id}
                    userId={this.state.user ? this.state.user.id : null}
                    tournamentType={this.state.tournamentType}
                    handleFunding={this.handleFunding}
                    handleUserRegister={this.handleUserRegister}
                />
                <SelectWinnerModal
                    openState={this.state.selectWinnerModal}
                    closeModal={this.handleModalClose}
                    match={this.state.match}
                    handleWinner={this.handleWinner}
                />
            </div>
        );
    }
}

export default withStyles(componentsStyle)(Tournament);
