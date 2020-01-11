/*eslint-disable*/
import React from "react";
import {withStyles, Typography} from "@material-ui/core";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import moment from "moment/moment";
import gql from "graphql-tag";
import {Query} from "react-apollo";

const style = {
    cover: {
        height: "180px",
        width: "100%",
        display: "block"
    },
    cardBody: {
        paddingLeft: "1rem",
        paddingRight: "1rem"
    },
    gridContainer: {},
    viewMoreCard: {
        minHeight: "22rem",
        "text-align": "center",
        margin: "0",
        cursor: "pointer"
    },
    viewMoreButton: {
        display: "inline-block"
    },
    card: {
        maxHeight: "22rem",
        height: "22rem",
        cursor: "pointer"
    }
};

const GET_TOURNAMENTS = gql`
    {
        tournaments(count: 12, offset: 0) {
            game {
                id
                name
            }
            name
            description
            id
            teamSize
            coverImage
            thumbnail
            deadline
            createdAt
        }
    }
`;

const getRecentTournaments = (classes, handleRedirect) => (
    <Query query={GET_TOURNAMENTS} fetchPolicy="network-only">
        {({loading, error, data}) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;


            if (data.tournaments < 1) {
                return <h3>No tournaments yet.</h3>
            }

            const tournamentGrid = [];

            data.tournaments.map(tournament => {
                tournamentGrid.push(
                    <GridItem xs={12} sm={8} md={6} lg={4} xl={3} wrap="nowrap">
                        <Card
                            className={classes.card}
                            onClick={() => handleRedirect(`/tournament/${tournament.id}`)}
                        >
                            <img
                                src={tournament.thumbnail}
                                alt={"cover"}
                                className={classes.cover}
                            />
                            <CardBody className={classes.cardBody}>
                                <Typography variant="body2" noWrap>{tournament.game.name}</Typography>
                                <Typography variant="h6" noWrap>{tournament.name}</Typography>
                                <Typography variant="body2" style={{paddingTop: "1rem"}} noWrap>
                                    Date:{" "}
                                    {moment(
                                        tournament.deadline,
                                        "YYYY-MM-DDTHH:mm:ss:SSZ"
                                    ).format("LLL")}
                                </Typography>
                                <Typography variant="body2" noWrap>Team Size: {tournament.teamSize}</Typography>
                            </CardBody>
                        </Card>
                    </GridItem>
                );
            });

            return tournamentGrid;
        }}
    </Query>
);

function CurrentTournaments({...props}) {
    const {classes, handleRedirect} = props;
    return (
        <GridContainer justify="center" spacing={4}>
            {getRecentTournaments(classes, handleRedirect)}
        </GridContainer>
    );
}

export default withStyles(style)(CurrentTournaments);
