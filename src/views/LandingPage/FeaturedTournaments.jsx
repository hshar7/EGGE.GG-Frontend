/*eslint-disable*/
import React from "react";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Carousel from "react-slick/lib";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import {container} from "assets/jss/material-kit-react.jsx";
import gql from "graphql-tag";
import {Query} from "react-apollo";

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
        transform: "scale(2) translateY(29px)"
    },
    caption: {"z-index": 1, cursor: "pointer"},
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
    autoplay: true
};

const GET_TOURNAMENTS = gql`
    {
        findTournamentsByBool(count: 7, fieldName: "featured", fieldData: true) {
            name
            id
            coverImage
        }
    }
`;

const getFeaturedTournaments = (classes, handleRedirect) => (
    <Query query={GET_TOURNAMENTS}>
        {({loading, error, data}) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            const tournamentGrid = [];

            data.findTournamentsByBool.map(tournament => {
                tournamentGrid.push(
                    <div>
                        <img
                            src={tournament.coverImage}
                            alt={tournament.name}
                            className={classNames("slick-image", classes.image)}
                        />
                        <div
                            className={classNames(classes.caption, "slick-caption")}
                            onClick={() => handleRedirect(`/tournament/${tournament.id}`)}
                        >
                            <div className={classes.blur}>
                                <h2>|||||||||||||||||||||||||||||||||||||||||||||||</h2>
                            </div>
                            <div className={classes.captionText}>
                                <h3 style={{
                                    fontWeight: "bolder",
                                    fontSize: "48px",
                                    "-webkit-font-smoothing": "antialiased",
                                    "-webkit-text-stroke": "1px black",
                                    textShadow: "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
                                }}>{tournament.name}</h3>
                            </div>
                        </div>
                    </div>
                );
            });

            return (
                <Card carousel className={classes.cardStyle}>
                    <Carousel {...settings}>{tournamentGrid}</Carousel>
                </Card>
            );
        }}
    </Query>
);

function FeaturedTournaments({...props}) {
    const {classes, handleRedirect} = props;

    return (
        <div className={classNames(classes.container, classes.containerExtra)}>
            <GridContainer className={classes.gridContainer}>
                <GridItem xs={12} sm={12} md={12} className={classes.marginAuto}>
                    {getFeaturedTournaments(classes, handleRedirect)}
                </GridItem>
            </GridContainer>
        </div>
    );
}

export default withStyles(style)(FeaturedTournaments);
