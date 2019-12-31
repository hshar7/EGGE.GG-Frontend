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

const GET_TEAM = (id) => gql`{
    getTeam(id: "${id}") {
        id
        name
        members {
            id
            name
            username
            email
        }
    }
}`;

const ADD_MEMBER = gql`
    mutation ADD_MEMBER($teamId: String, $memberId: String) {
        addMember(teamId: $teamId, memberId: $memberId) {
            id
            name
            members {
                id
                name
                username
                email
            }
        }
    }`;

const REMOVE_MEMBER = gql`
    mutation REMOVE_MEMBER($teamId: String, $memberId: String) {
        removeMember(teamId: $teamId, memberId: $memberId) {
            id
            name
            members {
                id
                name
                username
                email
            }
        }
    }`;

const GET_ALL_USERS = gql`{
    users {
        id
        name
        username
        email
    }
}`;

class ModifyTeam extends Component {
    state = {
        users: [],
        currentMembers: [],
        name: ""
    };

    componentDidMount = () => {
        apolloClient.query({query: GET_ALL_USERS}).then(res => {
            this.setState({users: res.data.users});
        });
        apolloClient.query({query: GET_TEAM(this.props.match.params.id)}).then(res => {
            this.setState({name: res.data.getTeam.name});
            this.setState({currentMembers: res.data.getTeam.members});
        });
    };

    addMember = (id) => {
        apolloClient.mutate({
            mutation: ADD_MEMBER,
            variables: {teamId: this.props.match.params.id, memberId: id}
        }).then(res => {
            this.setState({currentMembers: res.data.addMember.members});
        })
    };

    removeMember = (id) => {
        apolloClient.mutate({
            mutation: REMOVE_MEMBER,
            variables: {teamId: this.props.match.params.id, memberId: id}
        }).then(res => {
            this.setState({currentMembers: res.data.removeMember.members});
        })
    };

    render = () => {
        return (
            <GridContainer justify="center" style={{marginTop: "3rem"}}>
                <GridItem xs={12} md={8} lg={6} xl={6}>
                    <Card plain={true}>
                        <h1>Add Or Remove Members</h1>
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
                                    disabled={true}
                                    value={this.state.name}
                                />
                                <MaterialTable
                                    title="Current Members"
                                    columns={[
                                        {title: 'Name', field: 'name'},
                                        {title: 'username', field: 'username'},
                                        {title: 'email', field: 'email'}
                                    ]}
                                    data={this.state.currentMembers}
                                    options={{
                                        search: true
                                    }}
                                    actions={[
                                        {
                                            icon: 'delete',
                                            tooltip: 'Remove Member',
                                            onClick: (event, rowData) => this.removeMember(rowData.id)
                                        }
                                    ]}
                                />
                                <MaterialTable
                                    title="Add More Members"
                                    columns={[
                                        {title: 'Name', field: 'name'},
                                        {title: 'username', field: 'username'},
                                        {title: 'email', field: 'email'},
                                    ]}
                                    data={this.state.users.filter(x => !this.state.currentMembers.filter(y => y.id === x.id).length > 0)}
                                    options={{
                                        search: true
                                    }}
                                    actions={[
                                        {
                                            icon: 'add',
                                            tooltip: 'Add Member',
                                            onClick: (event, rowData) => this.addMember(rowData.id)
                                        }
                                    ]}
                                />
                                <div style={{textAlign: "center"}}>
                                    <Button size="large" onClick={() => this.props.history.goBack()}
                                            style={{backgroundColor: "green", color: "white", marginTop: "2rem"}}>
                                        Save and go back
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

export default ModifyTeam;
