/*eslint-disable*/
import React from "react";
import image1 from "assets/img/bg.jpg";
import image2 from "assets/img/bg2.jpg";
import image3 from "assets/img/bg3.jpg";
import withStyles from "@material-ui/core/styles/withStyles";
import Carousel from "react-slick";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";

const style = {
  carousel: {
    marginRight: "-10rem",
    marginLeft: "-10rem"
  }
};
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true
};
function FeaturedTournaments({ ...props }) {
  const { classes } = props;

  return (
    <Card>
      <Carousel {...settings} className={classes.carousel}>
        <div>
          <img src={image1} alt="First slide" className="slick-image" />
          <div className="slick-caption">
            <h4>CSGO Team Liquid World Event 2019</h4>
          </div>
        </div>
        <div>
          <img src={image2} alt="Second slide" className="slick-image" />
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
  );
}

export default withStyles(style)(FeaturedTournaments);
