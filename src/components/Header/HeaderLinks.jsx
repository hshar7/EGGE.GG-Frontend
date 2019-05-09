/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
import Icon from "@material-ui/core/Icon";
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "components/CustomButtons/Button";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import Notifications from "components/Notification/Notifications.jsx";
import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";

function signOut() {
    localStorage.removeItem("userName");
    localStorage.removeItem("publicAddress");
    localStorage.removeItem("userId");
    localStorage.removeItem("jwtToken");
    window.location.reload();
}

function HeaderLinks({...props}) {
    const {classes, commenceSignIn} = props;

    const topRightButton = localStorage.getItem("userName") || localStorage.getItem("userId") ? (
        <CustomDropdown
            left
            caret={false}
            hoverColor="black"
            buttonText={
                <div>
                    <Icon className={classes.icons}>account_circle</Icon>
                    {localStorage.getItem("userName") ? localStorage.getItem("userName") : "Anonymous"}
                </div>
            }
            buttonProps={{
                className: classes.navLink + " " + classes.imageDropdownButton,
                color: "transparent"
            }}
            dropdownList={[
                <div
                    onClick={() => {
                        window.location.href = "/editUser";
                    }}
                >
                    My Profile
                </div>,
                <div
                    onClick={() => {
                        window.location.href = "/editUser";
                    }}
                >
                    Settings
                </div>,
                <div onClick={signOut}>Sign Out</div>
            ]}
        />
    ) : (
        <Button
            color="transparent"
            onClick={() => {
                commenceSignIn();
            }}
            block={true}
        >
            Sign In
        </Button>
    );

    return (
        <List className={classes.list}>
            <ListItem className={classes.listItem}>
                <Notifications/>
            </ListItem>
            <ListItem className={classes.listItem}>{topRightButton}</ListItem>
        </List>
    );
}

export default withStyles(headerLinksStyle)(HeaderLinks);
