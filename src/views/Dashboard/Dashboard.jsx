import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import {Card, CardHeader} from "@material-ui/core";
import CardBody from "../../components/Card/CardBody";

const style = {};

class Dashboard extends React.Component {
    render() {
        const {classes, history, ...rest} = this.props;
        return (
            <GridContainer justify="center">
                <GridItem xs={4}>
                    <Card>
                        <CardHeader>
                            <h1>User Ranks</h1>
                        </CardHeader>
                        <CardBody>
                            Working on it
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object
};

export default withStyles(style)(Dashboard);
