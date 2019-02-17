/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Input from "@material-ui/core/Input";
// core components
import Button from "components/CustomButtons/Button.jsx";
import leftHeaderLinksStyle from "assets/jss/material-kit-react/components/leftHeaderLinksStyle.jsx";

function LeftHeaderLinks({...props}) {
    const {classes} = props;

    return (
        <List className={classes.list}>
            <ListItem className={classes.listItem}>
                <Input
                    type={"search"}
                    placeholder={"Find organizers, tournaments, players..."}
                />
            </ListItem>
            <ListItem className={classes.listItem}>
                <Button
                    href="/organize"
                    color="transparent"
                    className={classes.navLink}
                >
                    Organize
                </Button>
            </ListItem>
            <ListItem className={classes.listItem}>
                <Button
                    href="/browse"
                    color="transparent"
                    className={classes.navLink}
                >
                    Browse
                </Button>
            </ListItem>
        </List>
    );
}

export default withStyles(leftHeaderLinksStyle)(LeftHeaderLinks);
