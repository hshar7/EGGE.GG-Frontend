import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import {Card, CardHeader} from "@material-ui/core";
import CardBody from "../../components/Card/CardBody";

const style = {};

class Dashboard extends React.Component {
    render() {
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
