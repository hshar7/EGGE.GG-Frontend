/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Input from "@material-ui/core/Input";
// core components
import Button from "@material-ui/core/Button";
import leftHeaderLinksStyle from "assets/jss/material-kit-react/components/leftHeaderLinksStyle.jsx";

function LeftHeaderLinks({ ...props }) {
  const { classes } = props;

  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Input
          placeholder={"Find organizers, tournaments, prizes..."}
          disableUnderline
          style={{
            minWidth: "20em",
            backgroundColor: "#F6F6F6",
            height: "35px",
            marginTop: "7px",
            borderRadius: "7px",
            padding: "4px",
            fontSize: "12px",
            marginRight: "10px"
          }}
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
        <Button href="/browse" color="transparent" className={classes.navLink}>
          Browse
        </Button>
      </ListItem>
    </List>
  );
}

export default withStyles(leftHeaderLinksStyle)(LeftHeaderLinks);
