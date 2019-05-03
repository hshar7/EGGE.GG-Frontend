/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
import Icon from "@material-ui/core/Icon";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import Notifications from "components/Notification/Notifications.jsx";
import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";

function signOut() {
  localStorage.removeItem("userName");
  localStorage.removeItem("publicAddress");
  localStorage.removeItem("userId");
  window.location.reload();
}

function HeaderLinks({ ...props }) {
  const { classes } = props;

  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Notifications />
      </ListItem>
      <ListItem className={classes.listItem}>
        <CustomDropdown
          left
          caret={false}
          hoverColor="black"
          buttonText={
            <div>
              {localStorage.getItem("userName")
                ? localStorage.getItem("userName")
                : "Sign In"}{" "}
              <Icon className={classes.icons}>account_circle</Icon>
            </div>
          }
          buttonProps={{
            className: classes.navLink + " " + classes.imageDropdownButton,
            color: "transparent"
          }}
          dropdownList={[
            <Link component={RouterLink} to="/editUser" block={true}>
              My Profile
            </Link>,
            <Link component={RouterLink} to="/editUser" block={true}>
              Settings
            </Link>,
            <div onClick={signOut}>Sign Out</div>
          ]}
        />
      </ListItem>
    </List>
  );
}

export default withStyles(headerLinksStyle)(HeaderLinks);
