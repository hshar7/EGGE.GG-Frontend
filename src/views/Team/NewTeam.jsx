import React, {Component} from 'react';
import {Button} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import MaterialTable from "material-table";
import {apolloClient} from "../../utils";
import gql from "graphql-tag";

const GET_ALL_USERS = gql`{
    users {
        id
        name
        username
        email
    }
}`;

const CREATE_NEW_TEAM = gql`
    mutation createTeam($name: String, $memberIds: [String]) {
        createTeam(name: $name, memberIds: $memberIds) {
            id
            name
            members {
                id
                name
                username
            }
        }
    }`;

class NewTeam extends Component {
    state = {
        users: [],
        name: "",
        memberIds: []
    };

    componentDidMount = () => {
        apolloClient.query({query: GET_ALL_USERS}).then(res => {
            this.setState({users: res.data.users});
        })
    };

    handleSimple = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    addSelectedUser = rows => {
        const memberIds = [];
        rows.forEach(row => memberIds.push(row.id));
        this.setState({memberIds: memberIds});
    };

    createTeam = (e) => {
        e.preventDefault();
        apolloClient.mutate({
            mutation: CREATE_NEW_TEAM,
            variables: {name: this.state.name, memberIds: this.state.memberIds}
        }).then(res => {
            this.props.history.goBack();
        })
    };

    render = () => {
        return (
            <GridContainer justify="center" style={{marginTop: "3rem"}}>
                <GridItem xs={12} md={8} lg={6} xl={6}>
                    <Card plain={true}>
                        <h1>Create New Team</h1>
                        <CardBody>
                            <form onSubmit={this.createTeam}>
                                <TextField
                                    id="outlined-basic"
                                    label="Team Name"
                                    name="name"
                                    autoFocus={true}
                                    margin="normal"
                                    variant="outlined"
                                    required={true}
                                    onChange={this.handleSimple}
                                />
                                <MaterialTable
                                    title="Add Members"
                                    columns={[
                                        {title: 'Name', field: 'name'},
                                        {title: 'username', field: 'username'},
                                        {title: 'email', field: 'email'},
                                    ]}
                                    data={this.state.users}
                                    options={{
                                        search: true,
                                        selection: true
                                    }}
                                    onSelectionChange={(rows) => this.addSelectedUser(rows)}
                                />
                                <div style={{textAlign: "center"}}>
                                    <Button size="large" type="submit"
                                            style={{backgroundColor: "green", color: "white", marginTop: "2rem"}}>
                                        Create
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        );
    }
}

export default NewTeam;
