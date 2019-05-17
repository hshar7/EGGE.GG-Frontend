// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Input from "@material-ui/core/Input/index";
import Datetime from "react-datetime/DateTime";
import FormControl from "@material-ui/core/FormControl/index";
// core components
import MenuItem from "@material-ui/core/MenuItem/index";
import Select from "@material-ui/core/Select/index";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import React from "react";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import assist from "bnc-assist";
import Web3 from "web3";
import abi from "../../abis/tournamentAbi";
import IPFS from "ipfs-mini";
import PrizeDistribution from "./PrizeDistribution";
import {apolloClient, prepUserForContract} from "utils";
import {base, contract_address, bn_id} from "../../constants";
import axios from "axios/index";
import MarkdownEditor from "../../components/MarkdownEditor/MarkdownEditor";
import gql from "graphql-tag";
import {InputAdornment} from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput";

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
        maxPlayers: 0,
        tokens: [],
        games: [],
        description: "*This is my Tournament*",
        prizeToken: "0x0000000000000000000000000000000000000000",
        bracketType: "SINGLE_ELIMINATION",
        prizeDescription: "This is just for fun, no prizes!",
        tournamentType: "PRIZE_POOL",
        format: "SINGLES",
        game: "",
        buyInFee: 0
    };

    componentDidMount() {
        this.setState({web3: new Web3(window.web3.currentProvider)});
        let bncAssistConfig = {
            dappId: bn_id,
            networkId: 4,
            web3: this.state.web3,
            messages: {
                txPending: () => {
                    return `Creating ${this.state.title}.`;
                },
                txConfirmed: () => {
                    return `Created ${this.state.title} Successfully.`;
                }
            }
        };
        this.setState({assistInstance: assist.init(bncAssistConfig)}, () => {
            prepUserForContract(this.state.assistInstance).then(
                responseData => {
                    this.setState({...this.state.user, user: responseData});
                }
            );
        });
        axios.get(`${base}/tokens`).then(response => {
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

    handleSubmit = event => {
        event.preventDefault();

        const tokenVersion =
            this.state.prizeToken === "0x0000000000000000000000000000000000000000"
                ? 0
                : 20;

        // Fix up size of distribution type
        const prizeDistribution = this.state.prizeDistribution;
        for (let i = 0; i < this.state.maxPlayers; i++) {
            if (prizeDistribution[i] === undefined) {
                prizeDistribution[i] = 0;
            }
        }
        this.setState({prizeDistribution: prizeDistribution});
        if (this.state.prizeToken === "other") {
            window.alert("Working on it!");
        } else {
            const ipfs = new IPFS({
                host: "ipfs.infura.io",
                port: "5001",
                protocol: "https"
            });
            ipfs.addJSON(
                {
                    name: this.state.title,
                    tournamentType: this.state.tournamentType,
                    bracketType: this.state.bracketType,
                    tournamentFormat: this.state.format,
                    description: this.state.description,
                    gameId: this.state.games.find((game) => game.name === this.state.game).id,
                    buyInFee: this.state.buyInFee
                },
                (err, ipfsHash) => {
                    if (ipfsHash) {
                        this.setState(
                            {
                                decoratedContract: this.state.assistInstance.Contract(
                                    this.state.web3.eth.contract(abi).at(contract_address)
                                )
                            },
                            () => {
                                this.state.decoratedContract.newTournament(
                                    this.state.user.publicAddress,
                                    ipfsHash,
                                    this.state.deadline,
                                    this.state.prizeToken,
                                    tokenVersion,
                                    this.state.maxPlayers,
                                    this.state.prizeDistribution,
                                    {from: this.state.user.publicAddress}
                                );
                            }
                        );
                    } else {
                        console.log({err});
                    }
                }
            );
        }
    };

    render() {
        const {classes} = this.props;

        let tokenList = [];
        this.state.tokens.forEach(token => {
            tokenList.push(
                <MenuItem
                    classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                    }}
                    value={token.address}
                >
                    {token.symbol}
                </MenuItem>
            );
        });
        tokenList.push(
            <MenuItem
                classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                }}
                value="other"
            >
                Other
            </MenuItem>
        );

        return <GridContainer>
            <GridItem>
                <Card plain={true}>
                    <CardHeader>
                        <h2 className={classes.cardTitle}>Create a tournament</h2>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={this.handleSubmit}>
                            <GridContainer>
                                <GridItem xs={4}>
                                    <h5>Tournament Name</h5>
                                </GridItem>
                                <GridItem xs={8}>
                                    <Input
                                        fullWidth={true}
                                        inputProps={{
                                            name: "title",
                                            type: "text",
                                            onChange: this.handleSimple,
                                            required: true,
                                            autoFocus: true
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={4}>
                                    <h5>Description</h5>
                                </GridItem>
                                <GridItem xs={8}>
                                    <MarkdownEditor text={this.state.description}
                                                    handleTextChange={this.handleTextBox}/>
                                </GridItem>
                            </GridContainer>
                            <br/>
                            <GridContainer>
                                <GridItem xs={4}>
                                    <h5>Max Players</h5>
                                </GridItem>
                                <GridItem xs={8}>
                                    <Input
                                        inputProps={{
                                            name: "maxPlayers",
                                            type: "number",
                                            onChange: this.handleSimple,
                                            required: true
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={4}>
                                    <h5>Start Time</h5>
                                </GridItem>
                                <GridItem xs={8}>
                                    <FormControl fullWidth={false}>
                                        <Datetime
                                            onChange={this.handleDate}
                                            inputProps={{
                                                autoComplete: "off",
                                                name: "deadline",
                                                required: true
                                            }}
                                        />
                                    </FormControl>
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={4}>
                                    <h5>Game</h5>
                                </GridItem>
                                <GridItem xs={8}>
                                    <Select
                                        MenuProps={{
                                            className: classes.selectMenu
                                        }}
                                        classes={{
                                            select: classes.select
                                        }}
                                        onChange={this.handleSimple}
                                        value={this.state.game}
                                        inputProps={{
                                            name: "game",
                                            id: "game"
                                        }}
                                    >
                                        {this.state.games.map(game => {
                                            return <MenuItem
                                                classes={{
                                                    root: classes.selectMenuItem,
                                                    selected: classes.selectMenuItemSelected
                                                }}
                                                value={game.name}
                                            >
                                                {game.name}
                                            </MenuItem>
                                        })}
                                    </Select>
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={4}>
                                    <h5>Bracket Type</h5>
                                </GridItem>
                                <GridItem xs={8}>
                                    <Select
                                        MenuProps={{
                                            className: classes.selectMenu
                                        }}
                                        classes={{
                                            select: classes.select
                                        }}
                                        value={this.state.bracketType}
                                        inputProps={{
                                            name: "bracketType",
                                            id: "bracketType"
                                        }}
                                    >
                                        <MenuItem
                                            classes={{
                                                root: classes.selectMenuItem,
                                                selected: classes.selectMenuItemSelected
                                            }}
                                            value="SINGLE_ELIMINATION"
                                        >
                                            Single Elimination
                                        </MenuItem>
                                        <MenuItem
                                            classes={{
                                                root: classes.selectMenuItem,
                                                selected: classes.selectMenuItemSelected
                                            }}
                                            value="DOUBLE_ELIMINATION"
                                        >
                                            Double Elimination
                                        </MenuItem>
                                        <MenuItem
                                            classes={{
                                                root: classes.selectMenuItem,
                                                selected: classes.selectMenuItemSelected
                                            }}
                                            value="ROUND_ROBIN"
                                        >
                                            Round Robin
                                        </MenuItem>
                                    </Select>
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={4}>
                                    <h5>Format</h5>
                                </GridItem>
                                <GridItem xs={8}>
                                    <Select
                                        MenuProps={{
                                            className: classes.selectMenu
                                        }}
                                        classes={{
                                            select: classes.select
                                        }}
                                        value={this.state.format}
                                        inputProps={{
                                            name: "format",
                                            id: "format"
                                        }}
                                    >
                                        <MenuItem
                                            classes={{
                                                root: classes.selectMenuItem,
                                                selected: classes.selectMenuItemSelected
                                            }}
                                            value="SINGLES"
                                        >
                                            Singles (1v1)
                                        </MenuItem>
                                        <MenuItem
                                            classes={{
                                                root: classes.selectMenuItem,
                                                selected: classes.selectMenuItemSelected
                                            }}
                                            value="TEAMS"
                                        >
                                            Teams
                                        </MenuItem>
                                    </Select>
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={4}>
                                    <h5>Prize Token</h5>
                                </GridItem>
                                <GridItem xs={8}>
                                    <Select
                                        MenuProps={{
                                            className: classes.selectMenu
                                        }}
                                        classes={{
                                            select: classes.select
                                        }}
                                        value={this.state.prizeToken}
                                        onChange={this.handleSimple}
                                        inputProps={{
                                            name: "prizeToken",
                                            id: "prizeToken"
                                        }}
                                    >
                                        {tokenList}
                                    </Select>
                                </GridItem>
                            </GridContainer>
                            {this.state.prizeToken === "other" ? (
                                <GridContainer>
                                    <GridItem xs={4}>
                                        <h5>Prize Description</h5>
                                    </GridItem>
                                    <GridItem xs={8}>
                                        <Input
                                            fullWidth={true}
                                            multiline={true}
                                            rows={5}
                                            inputProps={{
                                                name: "prizeDescription",
                                                type: "text",
                                                value: this.state.prizeDescription,
                                                onChange: this.handleSimple,
                                                required: true
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                            ) : <div>
                                <GridContainer>
                                    <GridItem xs={4}>
                                        <h5>Tournament Type</h5>
                                    </GridItem>
                                    <GridItem xs={8}>
                                        <Select
                                            MenuProps={{
                                                className: classes.selectMenu
                                            }}
                                            classes={{
                                                select: classes.select
                                            }}
                                            onChange={this.handleSimple}
                                            value={this.state.tournamentType}
                                            inputProps={{
                                                name: "tournamentType",
                                                id: "tournamentType"
                                            }}
                                        >
                                            <MenuItem
                                                classes={{
                                                    root: classes.selectMenuItem,
                                                    selected: classes.selectMenuItemSelected
                                                }}
                                                value="PRIZE_POOL"
                                            >
                                                Prize Pool
                                            </MenuItem>
                                            <MenuItem
                                                classes={{
                                                    root: classes.selectMenuItem,
                                                    selected: classes.selectMenuItemSelected
                                                }}
                                                value="BUY_IN"
                                            >
                                                Buy In
                                            </MenuItem>
                                        </Select>
                                    </GridItem>
                                </GridContainer>
                                {this.state.tournamentType === "BUY_IN" ?
                                    <GridContainer>
                                        <GridItem xs={4}>
                                            <h5>Buy In Fee</h5>
                                        </GridItem>
                                        <GridItem xs={8}>
                                            <CustomInput
                                                inputProps={{
                                                    name: "buyInFee",
                                                    type: "text",
                                                    onChange: this.handleSimple,
                                                    required: true,
                                                    startAdornment: (
                                                        <InputAdornment
                                                            position="start">{this.state.tokens.find((token) => token.address === this.state.prizeToken).symbol}</InputAdornment>
                                                    )
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    : ""
                                }
                            </div>}
                            <PrizeDistribution
                                maxPlayers={this.state.maxPlayers}
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
