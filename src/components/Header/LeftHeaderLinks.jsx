import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import leftHeaderLinksStyle from "assets/jss/material-kit-react/components/leftHeaderLinksStyle.jsx";
import Button from "../CustomButtons/Button";

function LeftHeaderLinks({...props}) {
    const {classes} = props;
    const userSignedIn = localStorage.getItem("username") || localStorage.getItem("userId");
    const userOrganizer = userSignedIn && localStorage.getItem("organizer");

    return (
        <List className={classes.list}>
            {userSignedIn ?
                <ListItem className={classes.listItem}>
                    <Button
                        onClick={() => {
                            props.history.push("/myTeams")
                        }}
                        color="transparent"
                        className={classes.navLink}
                    >
                        Manage Teams
                    </Button>
                </ListItem>
            : ""}
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
            {userOrganizer ?
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
            : ""}
        </List>
    );
}

export default withStyles(leftHeaderLinksStyle)(LeftHeaderLinks);
