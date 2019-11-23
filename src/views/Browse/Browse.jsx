import React from "react";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import imagesStyle from "assets/jss/material-kit-react/imagesStyles.jsx";
import gql from "graphql-tag";
import {apolloClient} from "../../utils";

class Browse extends React.Component {
    state = {
        games: []
    };

    GET_GAMES = gql`
        {
            games(count: 32) {
                name
                url
                id
            }
        }
    `;

    componentDidMount() {
        apolloClient.query(
            {query: this.GET_GAMES}
        ).then(response => {
            this.setState({games: response.data.games});
        });
    }

    redirect = id => {
        this.props.history.push("/browseTournaments/" + id);
    };

    render() {
        const {classes} = this.props;

        let gamesList = [];
        this.state.games.forEach(game => {
            gamesList.push(
                <GridItem
                    xs={12}
                    md={6}
                    lg={2}
                    xl={2}
                    className={classes.browseStyle}
                    style={{cursor: "pointer"}}
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
                <GridContainer className={classNames(classes.main, classes.mainRaised)}>
                    {gamesList}
                </GridContainer>
            </div>
        );
    }
}

export default withStyles(imagesStyle)(Browse);
