import React, {Component} from 'react';
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import MaterialTable from "material-table";
import gql from "graphql-tag";
import {apolloClient} from "../../utils";
import Button from "../../components/CustomButtons/Button";

const GET_MY_TEAMS = gql`{
    getMyTeams {
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
        apolloClient.query({query: GET_MY_TEAMS}).then(res => {
            res.data.getMyTeams.forEach(team => team["memberCount"] = team.members.length);
            res.data.getMyTeams.forEach(team => team["ownerName"] = team.owner.username);
            this.setState({teams: res.data.getMyTeams});
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
