/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
import Icon from "@material-ui/core/Icon";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import Button from "components/CustomButtons/Button.jsx";

import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";

function HeaderLinks({...props}) {
    const {classes, username} = props;
    return (
        <List className={classes.list}>
            <ListItem className={classes.listItem}>
                <Button
                    href="https://www.creative-tim.com/product/material-kit-react"
                    color="transparent"
                    target="_blank"
                    className={classes.navLink}
                >
                    <Icon className={classes.icons}>more_horiz</Icon>
                </Button>
            </ListItem>
            <ListItem className={classes.listItem}>
                <Button
                    href="https://www.creative-tim.com/product/material-kit-react"
                    color="transparent"
                    target="_blank"
                    className={classes.navLink}
                >
                    <Icon className={classes.icons}>notifications</Icon>
                </Button>
            </ListItem>
            <ListItem className={classes.listItem}>
                <CustomDropdown
                    left
                    caret={false}
                    hoverColor="black"
                    buttonText={<div>{username} <Icon className={classes.icons}>account_circle</Icon></div>}
                    buttonProps={{
                        className:
                            classes.navLink + " " + classes.imageDropdownButton,
                        color: "transparent"
                    }}
                    dropdownList={[
                        "Me",
                        "Settings and other stuff",
                        "Sign out"
                    ]}
                />
            </ListItem>
        </List>
    );
}

export default withStyles(headerLinksStyle)(HeaderLinks);
