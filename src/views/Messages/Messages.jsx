/*eslint-disable*/
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

const style = {
    iframe: {
        marginTop: "3rem"
    }
};

function Messages({...props}) {
    const {classes} = props;
    return (
        <GridContainer justify="center" spacing={8}>
            <div className={classes.iframe}>
                <iframe
                    src={`https://discordapp.com/widget?id=578130923149721630&theme=light&username=${localStorage.getItem("userName")}`}
                    width="450"
                    height="800" allowTransparency="true" frameBorder="0"/>
            </div>
        </GridContainer>
    );
}

export default withStyles(style)(Messages);
