import React from "react";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Header from "components/Header/Header.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import imagesStyle from "assets/jss/material-kit-react/imagesStyles.jsx";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { base } from "../../constants";

class Browse extends React.Component {
  state = {
    games: []
  };

  componentDidMount() {
    axios.get(`${base}/games`).then(response => {
      this.setState({ games: response.data });
    });
  }

  redirect = id => {
    this.setState({ redirectPath: "/browseTournaments/" + id });
    this.setState({ redirect: true });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirectPath} />;
    }
  };

  render() {
    const { classes, ...rest } = this.props;

    let gamesList = [];
    this.state.games.forEach(game => {
      gamesList.push(
        <GridItem
          xs={12}
          md={6}
          lg={2}
          xl={2}
          className={classes.browseStyle}
          style={{ cursor: "pointer" }}
          onClick={() => {
            this.redirect(game.id);
          }}
        >
          <h4>{game.name}</h4>
          <img
            src={game.url}
            alt={game.name}
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
          {gamesList}
        </GridContainer>
        {this.renderRedirect()}
      </div>
    );
  }
}

export default withStyles(imagesStyle)(Browse);
