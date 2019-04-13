// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Input from "@material-ui/core/Input";
// core components
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import React from "react";
import { Redirect } from 'react-router-dom';
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import assist from "bnc-assist";
import Header from "components/Header/Header.jsx";
import LeftHeaderLinks from "components/Header/LeftHeaderLinks.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Web3 from "web3";
import abi from '../../abis/tournamentAbi';
import IPFS from "ipfs-mini";
import PrizeDistribution from "./PrizeDistribution";
import { onboardUser } from "../../utils/";

function isEmpty(str) {
    return (!str || 0 === str.length);
}

class Organize extends React.Component {
    state = {
        redirect: false,
        redirectPath: "",
        user: null,
        web3: null,
        assistInstance: null,
        contract: null,
        decoratedContract: null,
        prizeDistribution: [],
        maxPlayers: 0,
        prizeToken: 'ETH',
        type: 'singles',
        bracketType: 'se',
        prizeDescription: 'This is just for fun, no prizes!',
        enrollementType: 'freeEnty',
        daiAddress: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'
    };

    componentDidMount() {
        this.setState({ web3: new Web3(window.web3.currentProvider) });
        let bncAssistConfig = {
            dappId: 'cae96417-0f06-4935-864d-2d5f99e7d40f',
            networkId: 4,
            web3: this.state.web3
        };
        this.setState({ assistInstance: assist.init(bncAssistConfig) },
            () => {
                onboardUser(this.state.assistInstance, this.setState)
                    .then((responseData) => {
                        this.setState({ ...this.state.user, user: responseData });
                    });
            });
    }

    handleSimple = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handlePrize = event => {
        const prizeDistribution = this.state.prizeDistribution;
        prizeDistribution[Number(event.target.name)] = Number(event.target.value);
        this.setState({ prizeDistribution: prizeDistribution });
        console.log(this.state.prizeDistribution);
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirectPath} />
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();

        let tokenAddress = this.state.prizeToken === 'DAI' ? this.state.daiAddress : "0x0000000000000000000000000000000000000000";
        const tokenVersion = this.state.prizeToken === 'DAI' ? 20 : 0;

        if (this.state.prizeToken === 'other') {
            window.alert('Working on it!');
        } else {
            const ipfs = new IPFS({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });
            ipfs.addJSON({
                name: this.state.title,
                description: this.state.description,
                game: this.state.game,
                userId: this.state.user.id
            }, (err, result) => {
                if (result) {
                    let dataIpfsHash = result;

                    this.setState({ contract: this.state.web3.eth.contract(abi).at("0xa1242625874cc4e50bf12d4a343d45fb042c8b43") },
                        () => {
                            this.setState({ decoratedContract: this.state.assistInstance.Contract(this.state.contract) },
                                () => {
                                    this.state.decoratedContract.newTournament.sendTransaction(
                                        this.state.user.publicAddress,
                                        dataIpfsHash,
                                        Date.now(),
                                        tokenAddress,
                                        tokenVersion,
                                        this.state.maxPlayers,
                                        this.state.prizeDistribution,
                                        { from: this.state.user.publicAddress },
                                        (err, _) => {
                                            if (!err) {
                                                this.setState({ redirectPath: "/" });
                                                this.setState({ redirect: true });
                                            };
                                        })
                                });
                        });
                } else {
                    console.log({ err });
                }
            });
        }
    };

    render() {
        const { classes, ...rest } = this.props;
        return (
            <div>
                <Header
                    brand={<img src={require("assets/img/logo.svg")} alt="egge.gg" />}
                    rightLinks={<HeaderLinks />}
                    leftLinks={<LeftHeaderLinks />}
                    fixed
                    color="white"
                    {...rest}
                />
                <br />
                <br />
                <br />
                <GridContainer xs={10}>
                    <GridItem>
                        <Card>
                            <CardHeader>
                                <h2 className={classes.cardTitle}>Create a tournament</h2>
                            </CardHeader>
                            <CardBody>
                                <form onSubmit={this.handleSubmit}>
                                    <GridContainer>
                                        <GridItem xs={2}>
                                            <h5>Title</h5>
                                        </GridItem>
                                        <GridItem xs={5}>
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
                                        <GridItem xs={2}>
                                            <h5>
                                                Description
                                            </h5>
                                        </GridItem>
                                        <GridItem xs={10}>
                                            <Input
                                                fullWidth={true}
                                                multiline={true}
                                                rows={5}
                                                inputProps={{
                                                    name: "description",
                                                    type: "text",
                                                    onChange: this.handleSimple,
                                                    required: true
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <br />
                                    <GridContainer>
                                        <GridItem xs={2}>
                                            <h5>
                                                Max Players
                                            </h5>
                                        </GridItem>
                                        <GridItem xs={5}>
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
                                        <GridItem xs={2}>
                                            <h5>
                                                Game
                                            </h5>
                                        </GridItem>
                                        <GridItem xs={5}>
                                            <Input
                                                inputProps={{
                                                    name: "game",
                                                    type: "text",
                                                    onChange: this.handleSimple,
                                                    required: true,
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem xs={2}>
                                            <h5>
                                                Bracket Type
                                            </h5>
                                        </GridItem>
                                        <GridItem xs={5}>
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
                                                    value="se"
                                                >
                                                    Single Elimination
                                            </MenuItem>
                                                <MenuItem
                                                    classes={{
                                                        root: classes.selectMenuItem,
                                                        selected: classes.selectMenuItemSelected
                                                    }}
                                                    value="de"
                                                >
                                                    Double Elimination
                                            </MenuItem>
                                                <MenuItem
                                                    classes={{
                                                        root: classes.selectMenuItem,
                                                        selected: classes.selectMenuItemSelected
                                                    }}
                                                    value="rr"
                                                >
                                                    Round Robin
                                            </MenuItem>
                                            </Select>
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem xs={2}>
                                            <h5>
                                                Format
                                            </h5>
                                        </GridItem>
                                        <GridItem xs={5}>
                                            <Select
                                                MenuProps={{
                                                    className: classes.selectMenu
                                                }}
                                                classes={{
                                                    select: classes.select
                                                }}
                                                value={this.state.type}
                                                inputProps={{
                                                    name: "type",
                                                    id: "type"
                                                }}
                                            >
                                                <MenuItem
                                                    classes={{
                                                        root: classes.selectMenuItem,
                                                        selected: classes.selectMenuItemSelected
                                                    }}
                                                    value="singles"
                                                >
                                                    Singles (1v1)
                                            </MenuItem>
                                                <MenuItem
                                                    classes={{
                                                        root: classes.selectMenuItem,
                                                        selected: classes.selectMenuItemSelected
                                                    }}
                                                    value="de"
                                                >
                                                    Teams
                                            </MenuItem>
                                            </Select>
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem xs={2}>
                                            <h5>
                                                Prize Token
                                            </h5>
                                        </GridItem>
                                        <GridItem xs={5}>
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
                                                <MenuItem
                                                    classes={{
                                                        root: classes.selectMenuItem,
                                                        selected: classes.selectMenuItemSelected
                                                    }}
                                                    value="ETH"
                                                >
                                                    ETH
                                            </MenuItem>
                                                <MenuItem
                                                    classes={{
                                                        root: classes.selectMenuItem,
                                                        selected: classes.selectMenuItemSelected
                                                    }}
                                                    value="DAI"
                                                >
                                                    DAI
                                            </MenuItem>
                                                <MenuItem
                                                    classes={{
                                                        root: classes.selectMenuItem,
                                                        selected: classes.selectMenuItemSelected
                                                    }}
                                                    value="other"
                                                >
                                                    Other
                                            </MenuItem>
                                            </Select>
                                        </GridItem>
                                    </GridContainer>
                                    {this.state.prizeToken === 'other' ?
                                        <GridContainer>
                                            <GridItem xs={2}>
                                                <h5>
                                                    Prize Description
                                                </h5>
                                            </GridItem>
                                            <GridItem xs={10}>
                                                <Input
                                                    fullWidth={true}
                                                    multiline={true}
                                                    rows={5}
                                                    inputProps={{
                                                        name: "prizeDescription",
                                                        type: "text",
                                                        value: this.state.prizeDescription,
                                                        onChange: this.handleSimple,
                                                        required: true,
                                                    }}
                                                />
                                            </GridItem>
                                        </GridContainer>
                                        :
                                        <GridContainer>
                                            <GridItem xs={2}>
                                                <h5>
                                                    Enrollement Type
                                                </h5>
                                            </GridItem>
                                            <GridItem xs={10}>
                                                <Select
                                                    MenuProps={{
                                                        className: classes.selectMenu
                                                    }}
                                                    classes={{
                                                        select: classes.select
                                                    }}
                                                    value={this.state.enrollementType}
                                                    inputProps={{
                                                        name: "enrollementType",
                                                        id: "enrollementType"
                                                    }}
                                                >
                                                    <MenuItem
                                                        classes={{
                                                            root: classes.selectMenuItem,
                                                            selected: classes.selectMenuItemSelected
                                                        }}
                                                        value="freeEnty"
                                                    >
                                                        Free Enrollement
                                            </MenuItem>
                                                    <MenuItem
                                                        classes={{
                                                            root: classes.selectMenuItem,
                                                            selected: classes.selectMenuItemSelected
                                                        }}
                                                        value="buyIn"
                                                    >
                                                        Buy In
                                            </MenuItem>
                                                </Select>
                                            </GridItem>
                                        </GridContainer>}
                                    <PrizeDistribution maxPlayers={this.state.maxPlayers} handlePrize={this.handlePrize} bracketType={this.state.bracketType} />
                                    <br /><br />
                                    <GridContainer justify="center">
                                        <GridItem xs={2}>
                                            <Button type="primary" htmltype="submit" color="success"
                                                size="sm" block>
                                                Submit
                                            </Button>
                                        </GridItem>
                                    </GridContainer>
                                </form>
                            </CardBody>
                        </Card>
                    </GridItem>
                    {this.renderRedirect()}
                </GridContainer>
            </div>
        );
    }
}

export default withStyles(componentsStyle)(Organize);
