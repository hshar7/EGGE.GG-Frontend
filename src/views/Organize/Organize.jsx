// @material-ui/core components
import {withStyles, CircularProgress} from "@material-ui/core";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import React from "react";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import abi from "../../abis/tournamentAbi";
import IPFS from "ipfs-mini";
import PrizeDistribution from "./PrizeDistribution";
import {apolloClient, initWeb3, prepUserForContract} from "utils";
import {base, contract_address} from "../../constants";
import axios from "axios/index";
import gql from "graphql-tag";
import BasicDetails from "./BasicDetails";
import BracketDetails from "./BracketDetails";
import PrizeDetails from "./PrizeDetails";

const GET_GAMES = gql`{
    games(count: 30) {
        id
        name
        url
    }
}`;

class Organize extends React.Component {
    state = {
        user: null,
        web3: null,
        assistInstance: null,
        decoratedContract: null,
        prizeDistribution: [],
        pointsDistribution: [],
        rounds: 3,
        pointsToWin: 15,
        tokens: [],
        games: [],
        description: "### About This Tournament\n" +
            "This is my tournament...\n" +
            "\n" +
            "### Rules\n" +
            "\n" +
            "- No Cheating\n" +
            "- ?\n" +
            "\n" +
            "### Match Reporting Details\n" +
            "\n" +
            "- Both contestants must report match score\n" +
            "- ?\n" +
            "\n" +
            "### Other Details\n" +
            "\n" +
            "- Region: Global\n" +
            "- ?",
        prizeToken: "0x0000000000000000000000000000000000000000",
        bracketType: "SINGLE_ELIMINATION",
        prizeDescription: "This is just for fun, no prizes!",
        tournamentType: "PRIZE_POOL",
        teamSize: 5,
        maxTeams: 4,
        game: "DOTA 2",
        buyInFee: 0,
        submitted: false
    };

    componentDidMount = async () => {
        const web3Init = await initWeb3();
        this.setState({web3: web3Init.web3, assistInstance: web3Init.assistInstance});
        axios.get(`${base}/api/tokens`).then(response => {
            this.setState({tokens: response.data});
        });
        apolloClient.query({query: GET_GAMES}).then(response => {
            const data = response.data.games;
            this.setState({games: data});
        });
    }

    handleSimple = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleTextBox = value => {
        this.setState({description: value});
    };

    handleDate = event => {
        this.setState({deadline: event.valueOf()});
    };

    handlePrize = event => {
        const prizeDistribution = this.state.prizeDistribution;
        prizeDistribution[Number(event.target.name)] = Number(event.target.value);
        this.setState({prizeDistribution: prizeDistribution});
    };

    handlePointsDistribution = event => {
        const pointsDistribution = this.state.pointsDistribution;
        pointsDistribution[Number(event.target.name)] = Number(event.target.value);
        this.setState({pointsDistribution: pointsDistribution});
    };

    handleSubmit = event => {
        event.preventDefault();

        const tokenVersion =
            this.state.prizeToken === "0x0000000000000000000000000000000000000000" ? 0 : 20;

        // Fix up size of distribution type
        const prizeDistribution = this.state.prizeDistribution;
        for (let i = 0; i < this.state.maxTeams; i++) {
            if (prizeDistribution[i] === undefined) {
                prizeDistribution[i] = 0;
            }
        }
        this.setState({prizeDistribution: prizeDistribution});
        prepUserForContract(this.state.assistInstance, this.props.history).then(responseData => {
            this.setState({...this.state.user, user: responseData});
            const ipfs = new IPFS({
                host: "ipfs.infura.io",
                port: "5001",
                protocol: "https"
            });
            ipfs.addJSON(
                {
                    name: this.state.title,
                    description: this.state.description,
                    tournamentType: this.state.tournamentType,
                    bracketType: this.state.bracketType,
                    gameId: this.state.games.find((game) => game.name === this.state.game).id,
                    numberOfRounds: this.state.rounds,
                    pointsDistribution: this.state.pointsDistribution,
                    pointsToWin: this.state.pointsToWin,
                    buyInFee: this.state.buyInFee
                },
                (err, ipfsHash) => {
                    if (ipfsHash) {
                        this.setState({decoratedContract: this.state.assistInstance.Contract(this.state.web3.eth.contract(abi).at(contract_address))},
                            () => {
                                this.state.decoratedContract.newTournament(
                                    ipfsHash,
                                    this.state.deadline,
                                    this.state.prizeToken,
                                    tokenVersion,
                                    this.state.maxTeams,
                                    this.state.teamSize,
                                    this.state.prizeDistribution,
                                    "default",
                                    true,
                                    {from: this.state.user.publicAddress},
                                    (response) => {
                                        console.log({response})
                                    }
                                );
                            }
                        );
                    } else {
                        console.log({err});
                    }
                }
            );
            this.setState({submitted: true});
        });
    };

    render() {
        const {classes} = this.props;

        if (this.state.submitted) {
            return <GridContainer justify={"center"}>
                <GridItem xs={12} md={8} lg={6} xl={6}>
                    <Card plain={true} style={{textAlign: "center"}}>
                        <CardBody>
                            <CircularProgress/>
                            <h1>Your transaction is being confirmed</h1>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        }

        return <GridContainer justify={"center"}>
            <GridItem xs={12} md={8} lg={6} xl={6}>
                <Card plain={true}>
                    <CardHeader>
                        <h1 className={classes.cardTitle}>Create A New Tournament</h1>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={this.handleSubmit}>
                            <GridContainer>
                                <GridItem xs={12}>
                                    <h2>Basic Details</h2>
                                </GridItem>
                            </GridContainer>
                            <hr/>
                            <BasicDetails
                                handleSimple={this.handleSimple} handleTextBox={this.handleTextBox}
                                handleDate={this.handleDate} description={this.state.description} game={this.state.game}
                                games={this.state.games}/>
                            <GridContainer>
                                <GridItem xs={12}>
                                    <h2>Bracket Details</h2>
                                </GridItem>
                            </GridContainer>
                            <hr/>
                            <BracketDetails handleSimple={this.handleSimple}
                                            handlePointsDistribution={this.handlePointsDistribution}
                                            teamSize={this.state.teamSize} maxTeams={this.state.maxTeams}
                                            bracketType={this.state.bracketType}/>
                            <GridContainer>
                                <GridItem xs={12}>
                                    <h2>Prize Details</h2>
                                </GridItem>
                            </GridContainer>
                            <hr/>
                            <PrizeDetails handleSimple={this.handleSimple} prizeToken={this.state.prizeToken}
                                          prizeDescription={this.state.prizeDescription}
                                          tournamentType={this.state.tournamentType} tokens={this.state.tokens}/>

                            <PrizeDistribution
                                maxTeams={this.state.maxTeams}
                                handlePrize={this.handlePrize}
                                bracketType={this.state.bracketType}
                            />
                            <br/>
                            <br/>
                            <GridContainer justify="center">
                                <GridItem xs={2}>
                                    <Button
                                        type="primary"
                                        htmltype="submit"
                                        color="success"
                                        size="sm"
                                        block
                                    >
                                        Submit
                                    </Button>
                                </GridItem>
                            </GridContainer>
                        </form>
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
    }
}

export default withStyles(componentsStyle)(Organize);
