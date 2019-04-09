// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Input from "@material-ui/core/Input";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import React from "react";
import { Redirect } from 'react-router-dom';
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import axios from "axios";
import assist from "bnc-assist";
import { base, web3_node } from "../../constants";
import Header from "components/Header/Header.jsx";
import LeftHeaderLinks from "components/Header/LeftHeaderLinks.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Web3 from "web3";
import abi from '../../abis/tournamentAbi';
import IPFS from "ipfs-mini";
import PrizeDistribution from "./PrizeDistribution";

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
        erc20: false,
        prizeDistribution: [],
        maxPlayers: 0
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
                let promise = new Promise(this.onboardUser);
                promise.then(() => { console.log("User Onboarded") });
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

        const tokenAddress = this.state.erc20 ? this.state.tokenAddress : "0x0000000000000000000000000000000000000000";
        const tokenVersion = this.state.erc20 ? 20 : 0;

        const ipfs = new IPFS({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });
        ipfs.addJSON({
            name: this.state.title,
            description: this.state.description,
            game: this.state.game,
            userId: this.state.user.id
        }, (err, result) => {
            if (result) {
                let dataIpfsHash = result;

                let promise = new Promise(this.onboardUser);
                promise.then(() => {
                    this.setState({ contract: this.state.web3.eth.contract(abi).at("0x056f0378db3cf4908a042c9a841ec792998bb3b4") },
                        () => {
                            this.setState({ decoratedContract: this.state.assistInstance.Contract(this.state.contract) },
                                () => { // TODO: Investigate why decorateContract fails here!
                                    this.state.contract.newTournament.sendTransaction(this.state.user.publicAddress, dataIpfsHash, Date.now(), tokenAddress, tokenVersion, this.state.maxPlayers, this.state.prizeDistribution, { from: this.state.user.publicAddress }, (err, result) => {
                                        if (!err) {
                                            this.setState({ redirectPath: "/" });
                                            this.setState({ redirect: true });
                                        };
                                    })
                                });
                        });
                });
            } else {
                console.log({ err });
            }

        });
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
                <br />
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
                                        <GridItem xs={5}>
                                            <Input
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    name: "description",
                                                    type: "text",
                                                    onChange: this.handleSimple,
                                                    required: true
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
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
                                                Prize Token
                                            </h5>
                                        </GridItem>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={this.state.erc20}
                                                    onChange={this.handleChange("erc20")}
                                                    value="erc20"
                                                    classes={{
                                                        switchBase: classes.switchBase,
                                                        checked: classes.switchChecked,
                                                        icon: classes.switchIcon,
                                                        iconChecked: classes.switchIconChecked,
                                                        bar: classes.switchBar
                                                    }}
                                                />
                                            }
                                            classes={{
                                                label: classes.label
                                            }}
                                            label={this.state.erc20 ? "ERC20 Tokens" : "ETH"}
                                        />
                                    </GridContainer>
                                    {this.state.erc20 ?
                                        <GridContainer>

                                            <GridItem xs={2}>
                                                <h5>
                                                    Token Address
                                                </h5>
                                            </GridItem>
                                            <GridItem xs={5}>
                                                <Input
                                                    inputProps={{
                                                        name: "tokenAddress",
                                                        type: "text",
                                                        onChange: this.handleSimple,
                                                        required: true
                                                    }}
                                                />
                                            </GridItem>
                                        </GridContainer>
                                        : ""}
                                    <PrizeDistribution maxPlayers={this.state.maxPlayers} handlePrize={this.handlePrize} />
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
