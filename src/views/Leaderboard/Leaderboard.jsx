import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import {Card, CardHeader, TableCell, TableHead, TableRow} from "@material-ui/core";
import CardBody from "../../components/Card/CardBody";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import MiniProfile from "components/User/MiniProfile";
import {apolloClient} from "utils";
import gql from "graphql-tag";

const style = {};

const GET_LEADERBOARD = gql`{
    leaderboard {
        id
        userName
        avatar
        organizationName
        userPublicAddress
        earningsUSD
    }
}`;

class Leaderboard extends React.Component {

    state = {
        leaderboard: []
    };

    componentDidMount = () => {
        apolloClient.query({query: GET_LEADERBOARD}).then(response => {
                const sortedLeaderboard = response.data.leaderboard.sort((x1, x2) => {
                    if (x1.earningsUSD < x2.earningsUSD) return 1;
                    else return -1;
                });
                this.setState({leaderboard: sortedLeaderboard});
            }
        );
    };

    render() {
        return (
            <GridContainer justify="center">
                <GridItem xs={12}>
                    <Card>
                        <CardHeader>
                            <h1>Players & Earnings</h1>
                        </CardHeader>
                        <CardBody>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Player</TableCell>
                                        <TableCell>Public Address</TableCell>
                                        <TableCell>Earnings (USD)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.leaderboard.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <MiniProfile userName={item.userName} userAvatar={item.avatar}
                                                             userOrgName={item.organizationName}
                                                             userId={item.id}/>
                                            </TableCell>
                                            <TableCell>
                                                <a href={"https://etherscan.io/address/" + item.userPublicAddress}
                                                   target="_blank" rel="noopener noreferrer">{item.userPublicAddress}</a>
                                            </TableCell>
                                            <TableCell>
                                                ${item.earningsUSD}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        );
    }
}

Leaderboard.propTypes = {
    classes: PropTypes.object
};

export default withStyles(style)(Leaderboard);
