import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import React from "react";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import axios from "axios/index";
import Input from "@material-ui/core/Input/index";
import {base} from "constants.js";
import {apolloClient} from "utils";
import gql from "graphql-tag";
import CardBody from "../../components/Card/CardBody";
import {sleep} from "utils";
import Snackbar from "../../components/Snackbar/Snackbar";

const EDIT_USER_METADATA = gql`
    mutation metadata($metadata: UpdateUserInput!) {
        updateMyMetadata(metadata: $metadata) {
            id
            name
            email
            username
        }
    }`;

const UPDATE_MY_PASSWORD = gql`
    mutation password($oldPassword: String, $newPassword: String) {
        updateMyPassword(oldPassword: $oldPassword, newPassword: $newPassword)
    }`;

const GET_MY_PROFILE = gql` {
    myProfile {
        id
        name
        email
        username
        publicAddress
        avatar
    }
}`;

class EditUserForm extends React.Component {
    state = {
        user: null,
        name: "",
        email: "",
        username: "",
        publicAddress: "",
        toastMessage: "",
        error: false,
        success: false
    };

    componentDidMount() {
        apolloClient
            .query({
                query: GET_MY_PROFILE
            }).then(response => {
            const responseData = response.data.myProfile;
            this.setState({...this.state.user, user: responseData});
            this.setState({name: responseData.name});
            this.setState({email: responseData.email});
            this.setState({username: responseData.username});
            this.setState({publicAddress: responseData.publicAddress});
            this.setState({avatar: responseData.avatar});
        }).catch(error => {
            this.setState({error: true});
            console.error({error});
        });
    }

    handleSimple = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleSubmit = event => {
        event.preventDefault();
        apolloClient
            .mutate({
                variables: {metadata: {name: this.state.name, email: this.state.email, username: this.state.username}},
                mutation: EDIT_USER_METADATA
            }).then(() => {
            this.setState({toastMessage: "Successfully updated."});
            this.setState({success: true});
        }).catch(error => {
            this.setState({toastMessage: "Error when updating user information."});
            this.setState({error: true});
            console.error({error});
        });
    };

    handleUpdatePassword = event => {
        event.preventDefault();
        apolloClient
            .mutate({
                variables: {oldPassword: this.state.oldPassword, newPassword: this.state.newPassword},
                mutation: UPDATE_MY_PASSWORD
            }).then(() => {
            this.setState({toastMessage: "Successfully updated password."});
            this.setState({success: true});
        }).catch(error => {
            this.setState({toastMessage: "Error when updating password."});
            this.setState({error: true});
            console.error({error});
        });
    };

    handleAvatar = e => {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        axios
            .post(`${base}/api/user/myAvatar`, formData, {
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

    snackBar = () => {
        return <div><Snackbar
            message={this.state.toastMessage}
            close
            color="success"
            open={this.state.success}
            place="tl"
            closeNotification={() => this.setState({success: false})}
        /><Snackbar
            message={this.state.toastMessage}
            close
            color="danger"
            open={this.state.error}
            place="tl"
            closeNotification={() => this.setState({error: false})}
        />
        </div>
    };

    render() {
        const {classes} = this.props;

        return (
            <div>
                <GridContainer justify="center">
                    <GridItem xs={12} md={6} lg={6} xl={4}>
                        <Card>
                            <CardHeader>
                                <h2 className={classes.cardTitle}>My Information</h2>
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
                                                    autoFocus: false,
                                                    value: this.state.username
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
                                        <GridItem xs={12}>
                                            <h6>Note: This account is tied to the provided public address, therefore it
                                                cannot be changed. Please create a new account if you want to use a
                                                different public address.</h6>
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer justify="center">
                                        <GridItem xs={2}>
                                            <Button
                                                type="primary"
                                                color="success"
                                                htmltype="submit"
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
                    <GridItem xs={12} md={6} lg={6} xl={4}>
                        <Card>
                            <CardHeader>
                                <h2 className={classes.cardTitle}>Update Password</h2>
                            </CardHeader>
                            {!localStorage.getItem("jwtToken") ?
                                <h3>Please Sign In!</h3>
                                :
                                <form onSubmit={this.handleUpdatePassword}>
                                    <GridContainer justify="center">
                                        <GridItem xs={4}>
                                            <h5>Old Password</h5>
                                        </GridItem>
                                        <GridItem xs={8}>
                                            <Input
                                                fullWidth={true}
                                                inputProps={{
                                                    name: "oldPassword",
                                                    type: "password",
                                                    onChange: this.handleSimple,
                                                    required: true
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem xs={4}>
                                            <h5>New Password</h5>
                                        </GridItem>
                                        <GridItem xs={8}>
                                            <Input
                                                fullWidth={true}
                                                inputProps={{
                                                    name: "newPassword",
                                                    type: "password",
                                                    onChange: this.handleSimple,
                                                    required: true
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer justify="center">
                                        <GridItem xs={2}>
                                            <Button
                                                type="primary"
                                                color="success"
                                                htmltype="submit"
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
                    <GridItem xs={12} md={6} lg={6} xl={4}>
                        <Card>
                            <CardHeader>
                                <h2>My Avatar</h2>
                            </CardHeader>
                            <CardBody>
                                <div>
                                    <img style={{
                                        marginRight: "0.5rem",
                                        verticalAlign: "bottom",
                                        height: "10rem",
                                        width: "9.5rem"
                                    }}
                                         src={this.state.avatar} alt={this.state.name}/>
                                    <img style={{
                                        marginRight: "0.5rem",
                                        verticalAlign: "bottom",
                                        height: "5rem",
                                        width: "4.5rem"
                                    }} src={this.state.avatar}
                                         alt={this.state.name}/>
                                    <img style={{
                                        marginRight: "0.5rem",
                                        verticalAlign: "bottom",
                                        height: "2rem",
                                        width: "1.8rem"
                                    }} src={this.state.avatar}
                                         alt={this.state.name}/>
                                </div>
                                <br/>
                                <GridContainer justify="center">
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
                                            color="success"
                                            className={classes.button}
                                        >
                                            Upload New Avatar
                                        </Button>
                                    </label>
                                </GridContainer>
                            </CardBody>
                        </Card>
                    </GridItem>
                    {this.snackBar()}
                </GridContainer>
            </div>
        );
    }
}

export default withStyles(componentsStyle)(EditUserForm);
