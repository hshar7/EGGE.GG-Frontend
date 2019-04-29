import React from "react";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Header from "components/Header/Header.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import imagesStyle from "assets/jss/material-kit-react/imagesStyles.jsx";
import { Redirect } from "react-router-dom";

// sections for this page
import axios from "axios";
import { base } from "../../constants";

class BrowseTournaments extends React.Component {
  state = {
    tournaments: []
  };

  componentDidMount() {
    axios
      .get(
        `${base}/tournament/tournamentsByGameId/${
          this.props.match.params.gameId
        }`
      )
      .then(response => {
        this.setState({ tournaments: response.data });
      });
  }

  redirect = id => {
    this.setState({ redirectPath: "/tournament/" + id });
    this.setState({ redirect: true });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirectPath} />;
    }
  };

  render() {
    const { classes, ...rest } = this.props;

    let tournamentList = [];
    this.state.tournaments.forEach(tour => {
      tournamentList.push(
        <GridItem
          xs={3}
          style={{ "background-color": "white", cursor: "pointer" }}
          onClick={() => {
            this.redirect(tour.id);
          }}
        >
          <h5>{tour.name}</h5>
          <img
            src={tour.game.url}
            alt={tour.name}
            className={classNames(
              classes.browseStyle,
              classes.imgRaised,
              classes.imgRounded,
              classes.imgFluid
            )}
          />
        </GridItem>
      );
    });

    return (
      <div>
        <Header
          brand={<img src={require("assets/img/logo.svg")} alt={"egge.gg"} />}
          fixed
          color="white"
          changeColorOnScroll={{
            height: 400,
            color: "white"
          }}
          {...rest}
        />

        <GridContainer className={classNames(classes.main, classes.mainRaised)}>
          {tournamentList}
        </GridContainer>
        {this.renderRedirect()}
      </div>
    );
  }
}

export default withStyles(imagesStyle)(BrowseTournaments);
