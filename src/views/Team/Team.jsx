import React, {Component} from 'react';
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import MaterialTable from "material-table";
import gql from "graphql-tag";
import {apolloClient} from "../../utils";
import Button from "../../components/CustomButtons/Button";

const GET_TEAM = id => gql`{
    getTeam(id: "${id}") {
        id
        name
        members {
            id
            name
            username
            publicAddress
        }
        owner {
            name
            id
            username
            publicAddress
        }
    }
}`;

class Team extends Component {
    state = {team: null};

    componentDidMount = () => {
        apolloClient.query({query: GET_TEAM(this.props.match.params.id)}).then(res => {
            this.setState({team: res.data.getTeam});
        });
    };

    render = () => {

        if (this.state.team === null) {
            return <div/>;
        }

        return (
            <GridContainer justify="center">
                <GridItem xs={12} md={8} lg={6} xl={6}>
                    <h1>{this.state.team.name}</h1>
                    <h3>Owner: {this.state.team.owner.name}</h3>
                    <MaterialTable
                        title="Members"
                        columns={[
                            {title: 'Name', field: 'name'},
                            {title: 'Username', field: 'username'},
                            {title: 'Public Address', field: 'publicAddress'}
                        ]}
                        data={this.state.team.members}
                    />
                    {this.state.team.owner.id === localStorage.getItem("userId") ?
                        <div style={{textAlign: "center", marginTop: "2rem"}}>
                            <Button color="success" onClick={() => this.props.history.push("/newTeam")}>
                                Modify Team
                            </Button>
                        </div>
                        : ""}
                </GridItem>
            </GridContainer>
        );
    }
}

export default Team;
