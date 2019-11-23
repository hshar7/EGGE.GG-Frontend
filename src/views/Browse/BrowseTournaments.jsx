import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import moment from "moment/moment";
import gql from "graphql-tag";
import {Query} from "react-apollo";

const style = {
    carousel: {
        marginRight: "-10rem",
        marginLeft: "-10rem"
    },
    cover: {
        height: "180px",
        width: "100%",
        display: "block"
    },
    cardBody: {
        paddingLeft: "1rem",
        paddingRight: "1rem",
        padding: "0 0"
    },
    gridContainer: {
        margin: "1rem"
    },
    viewMoreCard: {
        minHeight: "22rem",
        "text-align": "center",
        overflow: "hidden",
        "white-space": "nowrap"
    },
    viewMoreButton: {
        display: "inline-block"
    },
    card: {
        maxHeight: "22rem",
        height: "22rem"
    }
};

class BrowseTournaments extends React.Component {
    state = {
        tournaments: []
    };

    GET_TOURNAMENTS = gql`
        {
            findTournamentsByString(count: 32, fieldName: "gameId", fieldData: "${this.props.match.params.gameId}") {
                game {
                    id
                    name
                }
                name
                description
                id
                coverImage
                deadline
                createdAt
            }
        }
    `;

    getRecentTournaments = (classes, handleRedirect) => (
        <Query query={this.GET_TOURNAMENTS}>
            {({loading, error, data}) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;

                const tournamentGrid = [];

                data.findTournamentsByString.map(tournament => {
                    tournamentGrid.push(
                        <GridItem xs={12} sm={6} md={4} lg={2} xl={2}>
                            <Card
                                className={classes.card}
                                onClick={() => handleRedirect(tournament.id)}
                            >
                                <img
                                    src={tournament.coverImage}
                                    alt={"cover"}
                                    className={classes.cover}
                                />
                                <CardBody className={classes.cardBody}>
                                    <h5>{tournament.game.name}</h5>
                                    <h4>{tournament.name}</h4>
                                    <p>
                                        Date:{" "}
                                        {moment(
                                            tournament.deadline,
                                            "YYYY-MM-DDTHH:mm:ss:SSZ"
                                        ).format("LLL")}
                                    </p>
                                    <p>Type: {tournament.tournamentFormat.toLower()}</p>
                                </CardBody>
                            </Card>
                        </GridItem>
                    );
                    return null;
                });

                return tournamentGrid;
            }}
        </Query>
    );

    handleRedirect = id => {
        this.props.history.push("/tournament/" + id);
    };

    render() {
        const {classes} = this.props;

        return (
            <div>
                <GridContainer spacing={8} className={classes.gridContainer}>
                    {this.getRecentTournaments(classes, this.handleRedirect)}
                </GridContainer>
            </div>
        );
    }
}

export default withStyles(style)(BrowseTournaments);
