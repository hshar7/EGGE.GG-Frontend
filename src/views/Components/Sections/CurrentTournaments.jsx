/*eslint-disable*/
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import moment from "moment";
import { Button } from "@material-ui/core";
import gql from "graphql-tag";
import { Query } from "react-apollo";

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
    padding: "1rem 1rem"
  },
  gridContainer: {
    margin: "1rem"
  },
  viewMoreCard: {
    minHeight: "22rem",
    "text-align": "center"
  },
  viewMoreButton: {
    display: "inline-block"
  }
};

const GET_TOURNAMENTS = gql`
  {
    tournaments(count: 11) {
      game {
        name
      }
      name
      description
      id
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
              onClick={() => handleRedirect(`/tournament/${tournament.id}`)}
            >
              <img
                src={require("assets/img/cover.jpg")}
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
    <GridContainer spacing={8} className={classes.gridContainer}>
      <GridItem xs={12}>
        <h2>Current Tournaments</h2>
      </GridItem>
      {getRecentTournaments(classes, handleRedirect)}
      <GridItem xs={12} sm={6} md={4} lg={2} xl={2}>
        <Card
          className={classes.viewMoreCard}
          onClick={() => handleRedirect("browse")}
        >
          <CardBody className={classes.cardBody}>
            <Button className={classes.viewMoreButton}>View More</Button>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

export default withStyles(style)(CurrentTournaments);
