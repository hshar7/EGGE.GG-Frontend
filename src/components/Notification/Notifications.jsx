import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {Redirect} from "react-router-dom";
import Icon from "@material-ui/core/Icon";
import SockJsClient from "react-stomp";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import notificationsStyle from "assets/jss/material-kit-react/components/notificationsStyle.jsx";
import Snackbars from "components/Snackbar/Snackbar.jsx";
import moment from "moment";
import gql from "graphql-tag";
import {apolloClient} from "utils";


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
        redirect: false,
        redirectPath: "",
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
                    query: GET_NOTIFICATIONS(localStorage.getItem("userId"))
                }).then(response => {
                if (response.loading) return "Loading...";
                if (response.error) return `Error!`;
                const data = response.data;
                this.setState({
                    ...this.state.notifications,
                    notifications: data.notifications
                });
                this.setState({notificationMessage: response.data[0].message});
                this.setState({snackbarUrl: response.data[0].url});
                this.setState({notificationSnackbar: true});
                this.setState({newNotification: true});
                this.setState({notifications: response.data});
            });
        }
    };

    handleNotificationClick = url => {
        this.setState({redirectPath: url});
        this.setState({redirect: true});
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirectPath}/>;
        }
    };

    render() {
        const {classes} = this.props;

        const notificationList = [];

        this.state.notifications.forEach(notification => {
            notificationList.push(
                <p onClick={() => this.handleNotificationClick(notification.url)}>
                    {notification.message} <br/>
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
                        color: this.state.newNotification ? "warning" : "transparent"
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
                {this.renderRedirect()}
            </div>
        );
    }
}

export default withStyles(notificationsStyle)(Notifications);
