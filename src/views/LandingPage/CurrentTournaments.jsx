/*eslint-disable*/
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import moment from "moment/moment";
import { Button } from "@material-ui/core";
import gql from "graphql-tag";
import { Query } from "react-apollo/index";

const style = {
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
  gridContainer: {},
  viewMoreCard: {
    minHeight: "22rem",
    "text-align": "center",
    overflow: "hidden",
    "white-space": "nowrap",
    margin: "0",
    cursor: "pointer"
  },
  viewMoreButton: {
    display: "inline-block"
  },
  card: {
    maxHeight: "22rem",
    height: "22rem",
    margin: "0",
    cursor: "pointer"
  }
};

const GET_TOURNAMENTS = gql`
  {
    tournaments(count: 11) {
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

const getRecentTournaments = (classes, handleRedirect) => (
  <Query query={GET_TOURNAMENTS}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;

      const tournamentGrid = [];

      data.tournaments.map(tournament => {
        tournamentGrid.push(
          <GridItem xs={12} sm={6} md={4} lg={2} xl={2}>
            <Card
              className={classes.card}
              onClick={() => handleRedirect(`/tournament/${tournament.id}`)}
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
                <p>Type: 1v1</p>
              </CardBody>
            </Card>
          </GridItem>
        );
      });

      return tournamentGrid;
    }}
  </Query>
);

function CurrentTournaments({ ...props }) {
  const { classes, handleRedirect } = props;
  return (
    <GridContainer spacing={8} className={classes.gridContainer} justify="center">
      <GridItem xs={12}>
        <h3 style={{ whiteSpace: "nowrap" }}>Current Tournaments</h3>
      </GridItem>
      {getRecentTournaments(classes, handleRedirect)}
    </GridContainer>
  );
}

export default withStyles(style)(CurrentTournaments);
