/*eslint-disable*/
import React from "react";
import image1 from "assets/img/bg.jpg";
import image2 from "assets/img/bg2.jpg";
import image3 from "assets/img/bg3.jpg";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Carousel from "react-slick";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import { container } from "assets/jss/material-kit-react.jsx";

const style = {
  container,
  carousel: {},
  marginAuto: {
    marginLeft: "auto !important",
    marginRight: "auto !important"
  },
  cardStyle: {
    maxHeight: "30rem",
    marginTop: "-0.001rem",
    borderRadius: "0"
  },
  gridContainer: {
    marginLeft: "-2rem",
    marginRight: "-2rem"
  },
  image: {
    maxHeight: "30rem",
    "background-attachment": "fixed"
  },
  containerExtra: {
    overflow: "hidden"
  },
  blur: {
    color: "black",
    background: "inherit",
    filter: "blur(14px)",
    WebkitFilter: "blur(14px)",
    background: "inherit",
    transform: "scale(2) translateY(29px)"
  },
  caption: { "z-index": 1 },
  captionText: {
    background: "inherit",
    "background-attachment": "fixed"
  }
};
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false
};
function FeaturedTournaments({ ...props }) {
  const { classes } = props;

  return (
    <div className={classNames(classes.container, classes.containerExtra)}>
      <GridContainer className={classes.gridContainer}>
        <GridItem xs={12} sm={12} md={12} className={classes.marginAuto}>
          <Card carousel className={classes.cardStyle}>
            <Carousel {...settings}>
              <div>
                <img
                  src={image1}
                  alt="First slide"
                  className={classNames("slick-image", classes.image)}
                />
                <div className={classNames(classes.caption, "slick-caption")}>
                  <div className={classes.blur}>
                    <h2>|||||||||||||||||||||||||||||||||||||||||||||||</h2>
                  </div>
                  <div className={classes.captionText}>
                    <h3 style={{ fontWeight: "bolder" }}>
                      CSGO Team Liquid World Event 2019
                    </h3>
                  </div>
                </div>
              </div>
              <div>
                <img
                  src={image2}
                  alt="Second slide"
                  className={classNames("slick-image", classes.image)}
                />
                <div className="slick-caption">
                  <h4>DotA2 StarLadder #7</h4>
                </div>
              </div>
              <div>
                <img
                  src={image3}
                  alt="Third slide"
                  className={classNames("slick-image", classes.image)}
                />
                <div className="slick-caption">
                  <h4>LoL Amateur Qualifiers For Worlds 2019</h4>
                </div>
              </div>
            </Carousel>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default withStyles(style)(FeaturedTournaments);
