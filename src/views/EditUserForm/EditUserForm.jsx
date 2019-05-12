import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import React from "react";
import {Redirect} from "react-router-dom";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import axios from "axios/index";
import assist from "bnc-assist";
import Input from "@material-ui/core/Input/index";
import {base, bn_id} from "constants.js";
import Web3 from "web3";
import CreateOrgModal from "./CreateOrgModal";
import {apolloClient} from "utils";
import gql from "graphql-tag";
import Icon from "@material-ui/core/Icon";

const CREATE_ORGANIZATION = gql`
    mutation createOrganization($organization: OrganizationInput!) {
        createOrganization(organization: $organization) {
            id
            name
        }
    }`;

const GET_MY_PROFILE = gql` {
    myProfile {
        id
        name
        email
        publicAddress
        organization {
            id
            name
        }
    }
}`;

class EditUserForm extends React.Component {
    state = {
        redirect: false,
        redirectPath: "",
        user: null,
        web3: null,
        name: "",
        email: "",
        organizationName: "No Org!",
        organizationId: "",
        publicAddress: "",
        assistInstance: null,
        createOrgModal: false
    };

    componentDidMount() {
        this.setState({web3: new Web3(window.web3.currentProvider)});

        let bncAssistConfig = {
            dappId: bn_id,
            web3: this.state.web3,
            networkId: 4
        };

        this.setState({assistInstance: assist.init(bncAssistConfig)}, () => {
            apolloClient
                .query({
                    query: GET_MY_PROFILE
                }).then(response => {
                    const responseData = response.data.myProfile;
                    this.setState({...this.state.user, user: responseData});
                    this.setState({name: responseData.name});
                    this.setState({email: responseData.email});
                    this.setState({publicAddress: responseData.publicAddress});
                    if (responseData.organization) {
                        this.setState({organizationName: responseData.organization.name});
                        this.setState({organizationId: responseData.organization.id});
                    }
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

    createOrg = () => {
        this.setState({createOrgModal: true});
    };

    saveOrg = () => {
        apolloClient
            .mutate({
                variables: {organization: {name: this.state.organizationName}},
                mutation: CREATE_ORGANIZATION
            })
            .then(response => {
                if (response.loading) return "Loading...";
                if (response.error) return `Error!`;

                const org = response.data.createOrganization;
                this.setState({organizationName: org.name});
                this.setState({organizationId: org.id});
                return null;
            });
    };

    render() {
        const {classes} = this.props;

        return (
            <div>
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
                                                    autoFocus: false,
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
                                                    required: false,
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
                                            <Button
                                                onClick={() => {
                                                    this.setState({redirectPath: `/organization/${this.state.organizationId}`})
                                                    this.setState({redirect: true})
                                                }}
                                                    >
                                                    <Icon className={classes.icons}>account_circle</Icon>
                                                {this.state.organizationName}
                                                    </Button>
                                                    </GridItem>
                                                    </GridContainer>
                                                    <GridContainer>
                                                    <GridItem xs={5} md={2} lg={2} xl={2}>
                                                    <h5>Organization Options</h5>
                                                    </GridItem>
                                                    <GridItem xs={7} md={2} lg={2} xl={2}>
                                                    {this.state.organizationId ?
                                                    <Button
                                                    type="primary"
                                                    color="danger"
                                                    size="sm"
                                                    block
                                                    onClick={() => {
                                                    }}
                                                    >
                                                    Leave Organization
                                                    </Button>
                                                    :
                                                    <Button
                                                    type="primary"
                                                    color="success"
                                                    size="sm"
                                                    block
                                                    onClick={() => {
                                                    this.createOrg()
                                                    }}
                                                    >
                                                    Create New
                                                    </Button>
                                                    }
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
                                                    <CreateOrgModal
                                                    openState={this.state.createOrgModal}
                                                    closeModal={() => {
                                                    this.setState({createOrgModal: false})
                                                    }}
                                                    handleSimple={this.handleSimple}
                                                    saveOrg={this.saveOrg}
                                                    />
                                                    </div>
                                                    );
                                                    }
                                                    }

                                                    export default withStyles(componentsStyle)(EditUserForm);
