import FormLabel from "@material-ui/core/FormLabel";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Input from "@material-ui/core/Input";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import React from "react";
import {Redirect} from 'react-router-dom';
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import axios from "axios";
import assist from "bnc-assist";

import Header from "components/Header/Header.jsx";
import LeftHeaderLinks from "components/Header/LeftHeaderLinks.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Web3 from "web3";

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
        decoratedContract: null
    };

    componentWillMount() {
        this.setState({web3: new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/ca86eb9dcddc4f85b7a3046c6f6b7b62"))});
        let bncAssistConfig = {
            dappId: 'cae96417-0f06-4935-864d-2d5f99e7d40f',
            networkId: 4,
            web3: this.state.web3
        };
        this.setState({assistInstance: assist.init(bncAssistConfig)});
    }

    componentDidMount() {
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
                        }
                    })
                })
            }).catch(error => {
            console.log('error');
            console.log(error);
        });
    }

    handleSimple = event => {
        this.setState({[event.target.name]: event.target.value});
    };
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirectPath}/>
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();

        let abi = [{
            "constant": false,
            "inputs": [{"name": "_tournamentOrganizer", "type": "address"}, {"name": "_winnersPot", "type": "uint256"}],
            "name": "createNewTournament",
            "outputs": [{"name": "newContract", "type": "address"}],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getContractCount",
            "outputs": [{"name": "contractCount", "type": "uint256"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{"name": "", "type": "uint256"}],
            "name": "tournamentContracts",
            "outputs": [{"name": "", "type": "address"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        }, {
            "anonymous": false,
            "inputs": [{"indexed": false, "name": "contractAddress", "type": "address"}],
            "name": "tournamentCreated",
            "type": "event"
        }, {
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


        this.setState({contract: new this.state.web3.eth.Contract(abi, "0x7441AEdDCB827AF4a363E5e9977c613ad44e3683")},
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
                                this.state.decoratedContract.methods.createNewTournament(this.state.user.publicAddress, this.state.web3.utils.toWei(this.state.prize, 'ether')).send({from: this.state.user.publicAddress})
                                    .on('transactionHash', (hash) => {
                                        this.setState({deployedContractHash: hash});
                                    })
                                    .on('receipt', (receipt) => {
                                        axios.post("http://localhost:8080/api/tournament", {
                                            name: this.state.title,
                                            description: this.state.description,
                                            prize: this.state.prize,
                                            maxPlayers: this.state.maxPlayers,
                                            game: this.state.game,
                                            userId: this.state.user.id,
                                            contractHash: this.state.deployedContractHash
                                        }).then((response) => {
                                            this.setState({redirectPath: "/tournament/" + response.data.id});
                                            this.setState({redirect: true});
                                        })
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
        return (
            <div>
                <Header
                    brand={<img src={require("assets/img/logo.svg")} alt={"egge.gg"}/>}
                    rightLinks={<HeaderLinks/>}
                    leftLinks={<LeftHeaderLinks/>}
                    fixed
                    color="white"
                    {...rest}
                />
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <GridContainer>
                    <GridItem xs={10}>
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
                                                Prize
                                            </h5>
                                        </GridItem>
                                        <GridItem xs={5}>
                                            <Input
                                                inputProps={{
                                                    name: "prize",
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
                                    <GridContainer justify="center">
                                        <GridItem xs={2}>
                                            <Button type="primary" htmlType="submit" color="success" size="md" block>
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
