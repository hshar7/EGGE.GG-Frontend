import React, {Component} from 'react';
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import MaterialTable from "material-table";
import gql from "graphql-tag";
import {apolloClient} from "../../utils";
import Button from "../../components/CustomButtons/Button";

const GET_MY_OWNED_TEAMS = gql`{
    getMyOwnedTeams {
        id
        name
        members {
            id
            username
            publicAddress
        }
        owner {
            id
            username
            publicAddress
        }
    }
}`;

class MyTeams extends Component {
    state = {teams: []};

    componentDidMount = () => {
        apolloClient.query({query: GET_MY_OWNED_TEAMS, fetchPolicy: "network-only"}).then(res => {
            res.data.getMyOwnedTeams.forEach(team => team["memberCount"] = team.members.length);
            res.data.getMyOwnedTeams.forEach(team => team["ownerName"] = team.owner.username);
            this.setState({teams: res.data.getMyOwnedTeams});
        });
    };

    render = () => {
        return (
            <GridContainer justify="center">
                <GridItem xs={12} md={8} lg={6} xl={6}>
                    <MaterialTable
                        title="My Teams"
                        columns={[
                            {title: 'Name', field: 'name'},
                            {title: 'Members', field: 'memberCount'},
                            {title: 'Owner', field: 'ownerName'}
                        ]}
                        data={this.state.teams}
                        actions={[
                            {
                                icon: 'build',
                                tooltip: 'Modify',
                                onClick: (event, rowData) => {
                                    if (rowData.owner.id === localStorage.getItem("userId")) {
                                        this.props.history.push(`/modifyTeam/${rowData.id}`)
                                    } else {
                                        alert("You're not the owner of this team.");
                                    }
                                }
                            },
                            {
                                icon: 'pageview',
                                tooltip: 'View',
                                onClick: (event, rowData) => {
                                    this.props.history.push(`/team/${rowData.id}`)
                                }
                            }
                        ]}
                    />
                    <div style={{textAlign: "center", marginTop: "2rem"}}>
                        <Button color="success" onClick={() => this.props.history.push("/newTeam")}>
                            Create New Team
                        </Button>
                    </div>
                </GridItem>
            </GridContainer>
        );
    }
}

export default MyTeams;
