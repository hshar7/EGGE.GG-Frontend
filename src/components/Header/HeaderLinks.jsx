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
                    {localStorage.getItem("userName") ?
                        <div>
                            <img src={localStorage.getItem("userAvatar")} alt={""}
                                 style={{
                                     marginRight: "0.5rem",
                                     verticalAlign: "bottom",
                                     height: "2rem",
                                     width: "1.8rem",
                                     borderRadius: "0.5rem"
                                 }}/>
                            {localStorage.getItem("userName")}</div> :
                        <div><Icon className={classes.icons}>account_circle</Icon>Anonymous</div>}
                </div>
            }
            buttonProps={{
                className: classes.navLink + " " + classes.imageDropdownButton,
                color: "transparent",
                style: {padding: "0.5rem"}
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
