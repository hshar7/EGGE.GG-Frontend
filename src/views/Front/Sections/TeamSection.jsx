import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import teamStyle from "assets/jss/material-kit-react/views/landingPageSections/teamStyle.jsx";

class TeamSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (
        <div className={classes.section}>
          <h2 className={classes.title}>Features</h2>
          <div>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <Card plain>
                  <GridItem xs={12} sm={12} md={6} className={classes.itemGrid}>
                    <i className={classes.socials + " fas fa-trophy"} />
                  </GridItem>
                    <h4 className={classes.cardTitle}>
                      Prize Types
                      <br />
                    </h4>
                  <CardBody>
                    <p className={classes.description}>
                      You can choose to have players buy in to your tournament or operate a prize pool model.
                      If neither of these fits your needs you could just run the tournament in a traditional way
                      and manage the prizes elsewhere.
                    </p>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <Card plain>
                  <GridItem xs={12} sm={12} md={6} className={classes.itemGrid}>
                    <i className={classes.socials + " fas fa-random"} />
                  </GridItem>
                  <h4 className={classes.cardTitle}>
                    Bracket Types
                    <br />
                  </h4>
                  <CardBody>
                    <p className={classes.description}>
                      Supporting a variety of traditional bracket types such as single and double elimination,
                      you can also choose to organize a tournament using our unique battle royale system.
                    </p>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <Card plain>
                  <GridItem xs={12} sm={12} md={6} className={classes.itemGrid}>
                    <i className={classes.socials + " fas fa-address-card"} />
                  </GridItem>
                  <h4 className={classes.cardTitle}>
                    Verified Player Identity
                    <br />
                  </h4>
                  <CardBody>
                    <p className={classes.description}>
                      To use EggE.gg, a user must have a Web3 wallet such as Metamask. This is the only way to sign
                      up with the platform. Having a Metamask wallet allows us to verify the player&#39;s identity
                      without needing any manual labor.
                    </p>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
    );
  }
}

TeamSection.propTypes = {
  classes: PropTypes.object
};

export default withStyles(teamStyle)(TeamSection);
