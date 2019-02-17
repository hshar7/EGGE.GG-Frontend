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

function isEmpty(str) {
    return (!str || 0 === str.length);
}

class Organize extends React.Component {
    state = {
        redirect: false,
        redirectPath: "",
        user: null
    };


    assistInstance = null;

    componentWillMount() {
        let bncAssistConfig = {
            dappId: 'cae96417-0f06-4935-864d-2d5f99e7d40f',
            networkId: 4
        };

        this.assistInstance = assist.init(bncAssistConfig);
    }

    componentDidMount() {
        this.assistInstance.onboard()
            .then(() => {
                this.assistInstance.getState().then(state => {
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

        

        axios.post("http://localhost:8080/api/tournament", {
            name: this.state.title,
            description: this.state.description,
            prize: this.state.prize,
            maxPlayers: this.state.maxPlayers,
            game: this.state.game,
            userId: this.state.user.id
        }).then((response) => {
            this.setState({redirectPath: "/tournament/" + response.data.id});
            this.setState({redirect: true});
        })
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
