import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import {Redirect} from "react-router-dom";
import gql from "graphql-tag"
import {apolloClient} from "utils";
import CardBody from "../../components/Card/CardBody";

const style = {};

class Organization extends React.Component {
    state = {
        users: [],
        redirect: false,
        redirectPath: ""
    };

    GET_USERS = (id) => gql`{
        usersByOrganization(organizationId: "${id}") {
            id
            name
            publicAddress
        }
    }`;

    componentDidMount = () => {
        apolloClient
            .query({query: this.GET_USERS(this.props.match.params.organizationId)})
            .then(response => {
                const data = response.data.usersByOrganization;
                this.setState({users: data});
            })
    };

    handleRedirect = path => {
        this.setState({redirectPath: path});
        this.setState({redirect: true});
    };

    render = () => {
        const {classes} = this.props;
        if (this.state.redirect === true) {
            return <Redirect to={this.state.redirectPath}/>;
        }

        const members = [];
        this.state.users.forEach(user => {
            members.push(
                <p>{user.name}</p>
            )
        });
        return (
            <GridContainer>
                <GridItem xs={12}>
                    <Card>
                        <CardBody>
                            <h2>Members: </h2>
                            {members}
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        );
    }
}

export default withStyles(style)(Organization);
