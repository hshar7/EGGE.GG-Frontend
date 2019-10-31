/*eslint-disable*/
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "components/CustomButtons/Button";
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

    const userSignedIn = localStorage.getItem("userName") || localStorage.getItem("userId");

    const signedInButtons = <ListItem className={classes.listItem}><CustomDropdown
        left
        caret={false}
        hoverColor="black"
        buttonText={
            <img src={localStorage.getItem("userAvatar")} alt={""}
                 style={{
                     marginRight: "0.5rem",
                     verticalAlign: "bottom",
                     height: "2rem",
                     width: "1.8rem",
                     borderRadius: "15rem"
                 }}/>
        }
        buttonProps={{
            className: classes.navLink + " " + classes.imageDropdownButton,
            color: "transparent",
            style: {paddingTop: "0.5rem", paddingBottom: "0.3rem", paddingRight: "0.2rem"}
        }}
        dropdownList={[
            <div
                onClick={() => {
                    props.history.push("/editUser");
                }}
            >
                My Profile
            </div>,
            <div onClick={signOut}>Sign Out</div>
        ]}
    />
    </ListItem>;

    const signInButtons = [];
    signInButtons.push(<ListItem className={classes.listItem}>
            <Button
                color="transparent"
                onClick={() => {
                    props.history.push("/signUp");
                }}
                block={true}
            >
                Sign Up
            </Button>
        </ListItem>,
        <ListItem className={classes.listItem}>
            <Button
                color="transparent"
                onClick={() => {
                    commenceSignIn();
                }}
                block={true}
            >
                Sign In
            </Button>
        </ListItem>);

    return (
        <List className={classes.list}>
            <ListItem className={classes.listItem}>
                <Notifications history={props.history}/>
            </ListItem>
            {userSignedIn ? signedInButtons : signInButtons}
        </List>
    );
}

export default withStyles(headerLinksStyle)(HeaderLinks);
