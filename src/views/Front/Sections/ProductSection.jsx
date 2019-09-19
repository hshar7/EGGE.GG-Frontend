import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import autorenew from "@material-ui/icons/Autorenew";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import monetization_on from "@material-ui/icons/MonetizationOn";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import InfoArea from "components/InfoArea/InfoArea.jsx";

import productStyle from "assets/jss/material-kit-react/views/landingPageSections/productStyle.jsx";

class ProductSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (
        <div className={classes.section}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={8}>
              <h2 className={classes.title}>What Do We Mean By Next Level?</h2>
              <h5 className={classes.description}>
                Existing online gaming tournaments and leagues have a labor intensive
                process to verify winners and complete prize fulfillment. These processes are
                non-automated and require manual interactions to fulfil every individual
                payment. Both players and their teams have complained of unethical and
                non-transparent behavior within Esports leagues. A next level tournament is smart, automated and
                is aware of the game that is being played.
              </h5>
            </GridItem>
          </GridContainer>
          <div>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <InfoArea
                    title="Automated"
                    description="With the help of the blockchain we can define automated oracles that fetch match statistics from game APIs allowing the organizers to free their minds from worrying about entering match outcomes."
                    icon={autorenew}
                    iconColor="info"
                    vertical
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <InfoArea
                    title="Instant Prizes"
                    description="Whether the tournament pays with ETH, DAI, or any ERC20/721 token, we've got you covered with instantaneous payments and a sophisticated prize distribution smart contract."
                    icon={monetization_on}
                    iconColor="success"
                    vertical
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <InfoArea
                    title="Game Aware"
                    description="Having the platform be aware of the game that is being played help tremendously when gathering match information. With the help of our API we can make this even better by having the games call us to report match outcomes."
                    icon={VerifiedUser}
                    iconColor="danger"
                    vertical
                />
              </GridItem>
            </GridContainer>
          </div>
        </div>
    );
  }
}

ProductSection.propTypes = {
  classes: PropTypes.object
};

export default withStyles(productStyle)(ProductSection);
