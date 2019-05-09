// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import React from "react";
import {Redirect} from "react-router-dom";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import axios from "axios";
import assist from "bnc-assist";
import Input from "@material-ui/core/Input";
import Header from "components/Header/Header.jsx";
import {base} from "../../constants";
import Web3 from "web3";

class Organize extends React.Component {
    state = {
        redirect: false,
        redirectPath: "",
        user: null,
        web3: null,
        name: "",
        email: "",
        organization: "",
        publicAddress: "",
        assistInstance: null
    };

    componentDidMount() {
        this.setState({web3: new Web3(window.web3.currentProvider)});

        let bncAssistConfig = {
            dappId: "cae96417-0f06-4935-864d-2d5f99e7d40f",
            web3: this.state.web3,
            networkId: 4
        };

        this.setState({assistInstance: assist.init(bncAssistConfig)}, () => {
            axios.get(`${base}/user/me`).then(response => {
                    const responseData = response.data;
                    this.setState({...this.state.user, user: responseData});
                    this.setState({name: responseData.name});
                    this.setState({email: responseData.email});
                    this.setState({organization: responseData.organization});
                    this.setState({publicAddress: responseData.publicAddress});
                }
            ).catch(error => {
                console.log(error);
            });
        });
    }

    handleSimple = event => {
        this.setState({[event.target.name]: event.target.value});
    };
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirectPath}/>;
        }
    };
    handleSubmit = event => {
        event.preventDefault();
        axios
            .post(`${base}/user/${this.state.user.id}/metadata`, {
                name: this.state.name,
                email: this.state.email,
                organization: this.state.organization
            })
            .then((response) => {
                localStorage.setItem("userName", response.data.name);
            });
    };

    render() {
        const {classes, ...rest} = this.props;

        return (
            <div>
                <Header
                    brand={<img src={require("assets/img/logo.svg")} alt={"egge.gg"}/>}
                    fixed
                    color="white"
                    {...rest}
                />
                <GridContainer>
                    <GridItem>
                        <Card plain={true}>
                            <CardHeader>
                                <h2 className={classes.cardTitle}>Edit User</h2>
                            </CardHeader>
                            {!localStorage.getItem("jwtToken") ?
                                <h3>Please Sign In!</h3>
                                :
                                <form onSubmit={this.handleSubmit}>
                                    <GridContainer justify="center">
                                        <GridItem xs={5} md={2} lg={2} xl={2}>
                                            <h5>Public Address</h5>
                                        </GridItem>
                                        <GridItem xs={7} md={10} lg={10} xl={10}>
                                            <Input
                                                inputProps={{
                                                    disabled: true,
                                                    name: "publicAddress",
                                                    value: this.state.publicAddress
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem xs={5} md={2} lg={2} xl={2}>
                                            <h5>Name</h5>
                                        </GridItem>
                                        <GridItem xs={7} md={10} lg={10} xl={10}>
                                            <Input
                                                inputProps={{
                                                    name: "name",
                                                    type: "text",
                                                    onChange: this.handleSimple,
                                                    required: true,
                                                    autoFocus: true,
                                                    value: this.state.name
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem xs={5} md={2} lg={2} xl={2}>
                                            <h5>Email</h5>
                                        </GridItem>
                                        <GridItem xs={7} md={10} lg={10} xl={10}>
                                            <Input
                                                inputProps={{
                                                    name: "email",
                                                    type: "email",
                                                    onChange: this.handleSimple,
                                                    required: true,
                                                    value: this.state.email
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem xs={5} md={2} lg={2} xl={2}>
                                            <h5>Organization</h5>
                                        </GridItem>
                                        <GridItem xs={7} md={10} lg={10} xl={10}>
                                            <Input
                                                inputProps={{
                                                    name: "organization",
                                                    type: "text",
                                                    onChange: this.handleSimple,
                                                    required: true,
                                                    value: this.state.organization
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer justify="left-align">
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
                            }
                        </Card>
                    </GridItem>
                    {this.renderRedirect()}
                </GridContainer>
            </div>
        );
    }
}

export default withStyles(componentsStyle)(Organize);
