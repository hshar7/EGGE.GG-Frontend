import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import leftHeaderLinksStyle from "assets/jss/material-kit-react/components/leftHeaderLinksStyle.jsx";

function LeftHeaderLinks({...props}) {
    const {classes} = props;

    return (
        <List className={classes.list}>
            <ListItem className={classes.listItem}>
                <Button
                    onClick={() => {
                        props.history.push("/organize")
                    }}
                    color="transparent"
                    className={classes.navLink}
                >
                    Organize
                </Button>
            </ListItem>
            <ListItem className={classes.listItem}>
                <Button
                    onClick={() => {
                        props.history.push("/explore")
                    }}
                    color="transparent"
                    className={classes.navLink}
                >
                    Explore
                </Button>
            </ListItem>
        </List>
    );
}

export default withStyles(leftHeaderLinksStyle)(LeftHeaderLinks);
