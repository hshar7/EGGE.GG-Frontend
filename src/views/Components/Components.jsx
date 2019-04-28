import React from "react";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Header from "components/Header/Header.jsx";

// sections for this page
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import LeftHeaderLinks from "components/Header/LeftHeaderLinks.jsx";
import Tournaments from "./Tournaments";
import newHeader from "../../assets/img/test.png";
import Footer from "../../components/Footer/Footer";

import image1 from "assets/img/bg.jpg";
import image2 from "assets/img/bg2.jpg";
import image3 from "assets/img/bg3.jpg";
import Carousel from "react-slick";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

class Components extends React.Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const { classes, ...rest } = this.props;

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true
    };
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
        <div style={{ backgroundColor: "#E3162B", marginBottom: "50px" }}>
          <img
            src={newHeader}
            alt="banner"
            style={{
              width: "100%"
            }}
          />
        </div>
        <GridContainer>
          <GridItem xs={2} />
          <GridItem xs={8} className={classes.marginAuto}>
            <h3 style={{ color: "rgb(227, 22, 43)" }}>Featured Tournaments</h3>
            <Card>
              <Carousel {...settings}>
                <div>
                  <img src={image1} alt="First slide" className="slick-image" />
                  <div className="slick-caption">
                    <h4>CSGO Team Liquid World Event 2019</h4>
                  </div>
                </div>
                <div>
                  <img
                    src={image2}
                    alt="Second slide"
                    className="slick-image"
                  />
                  <div className="slick-caption">
                    <h4>DotA2 StarLadder #7</h4>
                  </div>
                </div>
                <div>
                  <img src={image3} alt="Third slide" className="slick-image" />
                  <div className="slick-caption">
                    <h4>LoL Amateur Qualifiers For Worlds 2019</h4>
                  </div>
                </div>
              </Carousel>
            </Card>
          </GridItem>
          <GridItem xs={2} />
          <GridItem xs={12}>
            <div className={classNames(classes.main, classes.mainRaised)}>
              <Tournaments />
            </div>
          </GridItem>
        </GridContainer>
        <Footer />
      </div>
    );
  }
}

export default withStyles(componentsStyle)(Components);
