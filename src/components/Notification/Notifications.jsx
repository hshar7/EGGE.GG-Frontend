import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
import SockJsClient from "react-stomp";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import notificationsStyle from "assets/jss/material-kit-react/components/notificationsStyle.jsx";
import Snackbars from "components/Snackbar/Snackbar.jsx";
import moment from "moment";
import gql from "graphql-tag";
import {apolloClient} from "utils";
import {base_ws} from "../../constants";

const GET_NOTIFICATIONS = userId => gql`
    {
        notifications(count: 7, userId: "${userId}") {
            id
            message
            url
            createdAt
        }
    }
`;

class Notifications extends React.Component {
    state = {
        notifications: [],
        newNotification: false,
        notificationMessage: "",
        notificationSnackbar: false,
        snackbarUrl: ""
    };

    componentDidMount = () => {
        apolloClient
            .query({
                query: GET_NOTIFICATIONS(localStorage.getItem("userId"))
            }).then(response => {
            if (response.loading) return "Loading...";
            if (response.error) return `Error!`;
            const data = response.data;
            this.setState({
                ...this.state.notifications,
                notifications: data.notifications
            });
        });
    };

    handleNotification = msg => {
        if (msg === localStorage.getItem("userId")) {
            apolloClient
                .query({
                    query: GET_NOTIFICATIONS(localStorage.getItem("userId")),
                    fetchPolicy: 'network-only'
                })
                .then(response => {
                    if (response.loading) return "Loading...";
                    if (response.error) return `Error!`;
                    const data = response.data;
                    this.setState({
                        notifications: data.notifications
                    });
                    this.setState({notificationMessage: data.notifications[0].message});
                    this.setState({snackbarUrl: data.notifications[0].url});
                    this.setState({notificationSnackbar: true});
                    this.setState({newNotification: true});
                });
        }
    };

    handleNotificationClick = url => {
        this.props.history.push(url);
    };

    render() {
        const {classes} = this.props;

        const notificationList = [];
        this.state.notifications.forEach(notification => {
            notificationList.push(
                <p onClick={() => this.handleNotificationClick(notification.url)}>
                    {notification.message} <br/>
                    {moment(notification.createdAt, "YYYY-MM-DDTHH:mm:ss:SSZ").fromNow()}
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
                        color: this.state.newNotification ? "warning" : "transparent"
                    }}
                    dropdownList={notificationList}
                />
                <SockJsClient
                    url={`${base_ws}/ws`}
                    topics={["/topic/notification"]}
                    onMessage={msg => this.handleNotification(msg)}
                    ref={client => {
                        this.clientRef = client;
                    }}
                />
                <Snackbars
                    place="tr"
                    color="success"
                    message={
                        <div
                            className={classes.snackbarMessage}
                            onClick={() =>
                                this.handleNotificationClick(this.state.snackbarUrl)
                            }
                        >
                            {this.state.notificationMessage}
                        </div>
                    }
                    close
                    open={this.state.notificationSnackbar}
                    closeNotification={() =>
                        this.setState({notificationSnackbar: false})
                    }
                />
            </div>
        );
    }
}

export default withStyles(notificationsStyle)(Notifications);
