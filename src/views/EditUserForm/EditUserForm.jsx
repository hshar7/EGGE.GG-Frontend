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
import CardBody from "../../components/Card/CardBody";
import {sleep} from "utils";

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
        avatar
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
                    this.setState({avatar: responseData.avatar});
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

    handleAvatar = e => {
        console.log(e.target.files);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        axios
            .post(`${base}/user/myAvatar`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then(response => {
                sleep(3000).then(() => {
                    this.setState({avatar: response.data.fileUrl});
                    localStorage.setItem("userAvatar", response.data.fileUrl);
                });
            });
    };

    render() {
        const {classes} = this.props;

        return (
            <div>
                <GridContainer>
                    <GridItem xs={12} md={6} lg={6} xl={6}>
                        <Card>
                            <CardHeader>
                                <h2 className={classes.cardTitle}>Edit User</h2>
                            </CardHeader>
                            {!localStorage.getItem("jwtToken") ?
                                <h3>Please Sign In!</h3>
                                :
                                <form onSubmit={this.handleSubmit}>
                                    <GridContainer justify="center">
                                        <GridItem xs={4}>
                                            <h5>Public Address</h5>
                                        </GridItem>
                                        <GridItem xs={8}>
                                            <Input
                                                fullWidth={true}
                                                inputProps={{
                                                    disabled: true,
                                                    name: "publicAddress",
                                                    value: this.state.publicAddress
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
                                            <h5>Organization</h5>
                                        </GridItem>
                                        <GridItem xs={8}>
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
                                        <GridItem xs={4}>
                                            <h5>Organization Options</h5>
                                        </GridItem>
                                        <GridItem xs={8}>
                                            {this.state.organizationId ?
                                                <Button
                                                    color="danger"
                                                    size="sm"
                                                    onClick={() => {
                                                    }}
                                                >
                                                    Leave Organization
                                                </Button>
                                                :
                                                <Button
                                                    color="success"
                                                    size="sm"
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
                    <GridItem xs={12} md={6} lg={6} xl={6}>
                        <Card>
                            <CardHeader>
                                <h2>User Avatar</h2>
                            </CardHeader>
                            <CardBody>
                                <div>
                                    <img style={{marginRight: "0.5rem", verticalAlign: "bottom", height: "10rem", width: "9.5rem"}}
                                         src={this.state.avatar} alt={this.state.name}/>
                                    <img style={{marginRight: "0.5rem", verticalAlign: "bottom", height: "5rem", width: "4.5rem"}} src={this.state.avatar}
                                         alt={this.state.name}/>
                                    <img style={{marginRight: "0.5rem", verticalAlign: "bottom", height: "2rem", width: "1.8rem"}} src={this.state.avatar}
                                         alt={this.state.name}/>
                                </div>

                                <br/>
                                <div>
                                    <input
                                        accept="image/*"
                                        className={classes.input}
                                        style={{display: "none"}}
                                        id="raised-button-file"
                                        multiple
                                        onChange={this.handleAvatar}
                                        type="file"
                                    />
                                    <label htmlFor="raised-button-file">
                                        <Button
                                            variant="raised"
                                            component="span"
                                            className={classes.button}
                                        >
                                            Upload New Avatar
                                        </Button>
                                    </label>
                                </div>
                            </CardBody>
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
