import React from "react";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Header from "components/Header/Header.jsx";

// sections for this page
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import FeaturedTournaments from "./Sections/FeaturedTournaments.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import LeftHeaderLinks from "components/Header/LeftHeaderLinks.jsx";
import newHeader from "../../assets/img/test.png";
import Footer from "../../components/Footer/Footer";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CurrentTournaments from "./Sections/CurrentTournaments.jsx";
import { Redirect } from "react-router-dom";

class Components extends React.Component {
  state = {
    redirect: false,
    redirectPath: ""
  };

  handleRedirect = path => {
    this.setState({ redirectPath: path });
    this.setState({ redirect: true });
  };

  render() {
    const { classes, ...rest } = this.props;
    if (this.state.redirect === true) {
      return <Redirect to={this.state.redirectPath} />;
    }
    return (
      <div>
        <Header
          brand={<img src={require("assets/img/logo.svg")} alt={"egge.gg"} />}
          rightLinks={<HeaderLinks />}
          leftLinks={<LeftHeaderLinks />}
          fixed
          color="white"
          changeColorOnScroll={{
            height: 400,
            color: "white"
          }}
          {...rest}
        />
        <div style={{ backgroundColor: "#E3162B", marginBottom: "30px" }}>
          <img
            src={newHeader}
            alt="banner"
            style={{
              width: "100%"
            }}
          />
        </div>
        <GridContainer>
          <GridItem xs={4} />
          <GridItem xs={4} className={classes.marginAuto}>
            <FeaturedTournaments />
          </GridItem>
          <GridItem xs={4} />
          <GridItem xs={12}>
            <div className={classNames(classes.main, classes.mainRaised)}>
              <CurrentTournaments handleRedirect={this.handleRedirect} />
            </div>
          </GridItem>
        </GridContainer>
        <Footer />
      </div>
    );
  }
}

export default withStyles(componentsStyle)(Components);
