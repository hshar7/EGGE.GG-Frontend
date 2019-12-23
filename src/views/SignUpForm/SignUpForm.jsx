import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import React from "react";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import assist from "bnc-assist";
import Input from "@material-ui/core/Input/index";
import {bn_id} from "constants.js";
import Web3 from "web3";
import {apolloClient} from "utils";
import gql from "graphql-tag";
import CardBody from "../../components/Card/CardBody";
import Divider from "@material-ui/core/Divider";
import Button from "../../components/CustomButtons/Button";
import Container from "@material-ui/core/Container";
import WalletIcon from "@material-ui/icons/AccountBalanceWallet";

const SIGNUP_USER = gql`
    mutation signUpUser($metadata: NewUserInput!) {
        signUpUser(metadata: $metadata) {
            id
            publicAddress
            username
            name
            email
        }
    }`;

class SignUpForm extends React.Component {
    state = {
        user: null,
        web3: null,
        name: "",
        email: "",
        publicAddress: "",
        assistInstance: null,
        idChoice: null,
        success: false,
        failure: false
    };

    handleSimple = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleSubmit = event => {
        event.preventDefault();
        apolloClient
            .mutate({
                variables: {
                    metadata: {
                        publicAddress: this.state.publicAddress,
                        username: this.state.username,
                        name: this.state.name,
                        email: this.state.email,
                        password: this.state.password
                    }
                },
                mutation: SIGNUP_USER
            }).then(() => {
            this.setState({success: true});
        }).catch(() => {
            this.setState({failure: true});
        });
    };

    render() {
        const {classes} = this.props;

        if (this.state.success) {
            return <GridContainer justify="center">
                <GridItem xs={6}>
                    <Card>
                        <CardBody>
                            <h3 style={{color: "green"}}>User successfully created, please sign in!</h3>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        }

        if (this.state.failure) {
            return <GridContainer justify="center">
                <GridItem xs={6}>
                    <Card>
                        <CardBody>
                            <h3 style={{color: "red"}}>Error creating user!</h3>
                            <Button color="danger" onClick={() => {
                                this.setState({failure: false})
                            }}>Try Again</Button>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        }

        if (this.state.idChoice === null) {
            return <GridContainer justify="center">
                <GridItem xs={6}>
                    <Card plain={true}>
                        <GridContainer justify="center">
                            <GridItem xs={10} style={{textAlign: "center"}}>
                                <h1>Proceed With:</h1>
                            </GridItem>
                            <GridItem xs={3}>
                                <Card plain={true}>
                                    <Container onClick={() => {
                                        this.setState({idChoice: "wallet"});
                                        this.setState({assistInstance: null});
                                    }}
                                               style={{
                                                   cursor: "pointer",
                                                   textAlign: "center",
                                                   backgroundColor: "#2e2b2d",
                                                   color: "white"
                                               }}>
                                        <img src={require("assets/img/mm.svg")} alt={"Metamask"}
                                             style={{height: "6rem"}}/>
                                        <div style={{marginTop: "0.5rem"}}>Web3 Enabled Browser</div>
                                    </Container>
                                </Card>
                            </GridItem>
                            <GridItem xs={3}>
                                <Card plain={true}>
                                    <Container onClick={() => {
                                        this.setState({idChoice: "text"});
                                        this.setState({publicAddress: ""});
                                    }}
                                               style={{
                                                   cursor: "pointer",
                                                   textAlign: "center",
                                                   backgroundColor: "#2e2b2d",
                                                   color: "white"
                                               }}>
                                        <WalletIcon fontSize="large" style={{
                                            height: "5.8rem",
                                            color: "white",
                                            transform: "scale(2.5)"
                                        }}/>
                                        <div style={{marginTop: "0.5rem"}}>Manually Providing Wallet</div>
                                    </Container>
                                </Card>
                            </GridItem>
                        </GridContainer>
                    </Card>
                </GridItem>
                <GridItem xs={8}>
                    <Divider/>
                </GridItem>
                <GridItem xs={6} style={{textAlign: "center"}}>
                    <h5>* Web3 Enabled Browser: Requires running on a browser with a Web3 plugin such as Metamask or
                        having a natively Web3-enabled browser such as Opera.</h5>
                    <h5>* Manually Providing Wallet: Requires owning an Ethereum wallet in which you own and secure.
                        Such as MyEtherWallet</h5>
                </GridItem>
            </GridContainer>
        } else {
            if (this.state.idChoice === "wallet") {
                if (this.state.assistInstance === null) {
                    this.setState({web3: new Web3(window.web3.currentProvider)}, () => {
                        let bncAssistConfig = {
                            dappId: bn_id,
                            web3: this.state.web3,
                            networkId: 4
                        };
                        this.setState({assistInstance: assist.init(bncAssistConfig)}, () => {
                            console.log(this.state.assistInstance);
                            this.state.assistInstance.onboard().then(() => {
                                this.state.assistInstance.getState().then(state => {
                                    this.setState({publicAddress: state.accountAddress});
                                });
                            });
                        });
                    });
                }
            }

            return <GridContainer justify="center">
                <GridItem xs={6} md={6} lg={6} xl={6}>
                    <Card>
                        <CardHeader>
                            <h2 className={classes.cardTitle}>Sign Up</h2>
                        </CardHeader>
                        <form onSubmit={this.handleSubmit}>
                            <GridContainer justify="center">
                                <GridItem xs={4}>
                                    <h5>Public Address</h5>
                                </GridItem>
                                <GridItem xs={8}>
                                    <Input
                                        fullWidth={true}
                                        inputProps={{
                                            disabled: this.state.idChoice === "wallet",
                                            name: "publicAddress",
                                            value: this.state.publicAddress
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={4}>
                                    <h5>Username</h5>
                                </GridItem>
                                <GridItem xs={8}>
                                    <Input
                                        fullWidth={true}
                                        inputProps={{
                                            name: "username",
                                            type: "text",
                                            onChange: this.handleSimple,
                                            required: true,
                                            autoFocus: true,
                                            value: this.state.username
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={4}>
                                    <h5>Name</h5>
                                </GridItem>
                                <GridItem xs={8}>
                                    <Input
                                        fullWidth={true}
                                        inputProps={{
                                            name: "name",
                                            type: "text",
                                            onChange: this.handleSimple,
                                            required: true,
                                            autoFocus: false,
                                            value: this.state.name
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={4}>
                                    <h5>Email</h5>
                                </GridItem>
                                <GridItem xs={8}>
                                    <Input
                                        fullWidth={true}
                                        inputProps={{
                                            name: "email",
                                            type: "email",
                                            onChange: this.handleSimple,
                                            required: false,
                                            value: this.state.email
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={4}>
                                    <h5>Password</h5>
                                </GridItem>
                                <GridItem xs={8}>
                                    <Input
                                        fullWidth={true}
                                        inputProps={{
                                            name: "password",
                                            type: "password",
                                            onChange: this.handleSimple,
                                            required: false,
                                            value: this.state.password
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                            <GridContainer justify="center">
                                <GridItem xs={2}>
                                    <Button
                                        type="primary"
                                        color="warning"
                                        size="lg"
                                        block
                                        style={{marginTop: "5rem"}}
                                        onClick={() => {
                                            this.setState({idChoice: null})
                                        }}
                                    >
                                        Back
                                    </Button>
                                </GridItem>
                                <GridItem xs={2}>
                                    <Button
                                        type="primary"
                                        color="success"
                                        htmltype="submit"
                                        size="lg"
                                        block
                                        style={{marginTop: "5rem"}}
                                    >
                                        Submit
                                    </Button>
                                </GridItem>
                            </GridContainer>
                        </form>
                    </Card>
                </GridItem>
            </GridContainer>
        }
    }
}

export default withStyles(componentsStyle)(SignUpForm);
