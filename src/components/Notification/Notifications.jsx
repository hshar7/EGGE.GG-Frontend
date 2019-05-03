import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { base } from "../../constants";
import Icon from "@material-ui/core/Icon";
import SockJsClient from "react-stomp";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import notificationsStyle from "assets/jss/material-kit-react/components/notificationsStyle.jsx";
import moment from "moment";

class Notifications extends React.Component {
  state = {
    redirect: false,
    redirectPath: "",
    notifications: [],
    newNotification: false
  };

  componentDidMount = () => {
    this.getNotifications();
  };

  handleNotification = msg => {
    if (msg === localStorage.getItem("userId")) {
      axios
        .get(`${base}/notifications/${localStorage.getItem("userId")}`)
        .then(response => {
          this.setState({ newNotification: true });
          this.setState({ notifications: response.data });
        });
    }
  };

  getNotifications = () => {
    axios
      .get(`${base}/notifications/${localStorage.getItem("userId")}`)
      .then(result => {
        this.setState({ notifications: result.data });
      });
  };

  handleNotificationClick = url => {
    this.setState({ redirectPath: url });
    this.setState({ redirect: true });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirectPath} />;
    }
  };

  render() {
    const { classes } = this.props;
    let notificationList = [];

    this.state.notifications.forEach(notification => {
      notificationList.push(
        <p onClick={() => this.handleNotificationClick(notification.url)}>
          {notification.message} <br />
          {moment(notification.createdAt, "lll").fromNow()}
        </p>
      );
    });

    return (
      <div>
        <CustomDropdown
          left
          caret={false}
          hoverColor="black"
          buttonText={
            <div>
              <Icon className={classes.icons}>notifications</Icon>
            </div>
          }
          buttonProps={{
            className: classes.navLink + " " + classes.imageDropdownButton,
            color: this.state.newNotification ? "red" : "transparent"
          }}
          dropdownList={notificationList}
        />
        <SockJsClient
          url="http://localhost:8080/ws"
          topics={["/topic/notification"]}
          onMessage={msg => this.handleNotification(msg)}
          ref={client => {
            this.clientRef = client;
          }}
        />
        {this.renderRedirect()}
      </div>
    );
  }
}

export default withStyles(notificationsStyle)(Notifications);
