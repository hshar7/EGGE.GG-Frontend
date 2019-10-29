import React from "react";
import ReactDOM from "react-dom";
import {createBrowserHistory} from "history";
import {Router, Route, Switch} from "react-router-dom";
import axios from "axios";
import "assets/scss/material-kit-react.scss?v=1.4.0";
import Header from "components/Header/Header.jsx";
// pages for this product
import LandingPage from "views/LandingPage/LandingPage.jsx";
import Tournament from "views/Tournament/Tournament.jsx";
import Organize from "views/Organize/Organize.jsx";
import EditUserForm from "views/EditUserForm/EditUserForm.jsx";
import Browse from "views/Browse/Browse.jsx";
import BrowseTournaments from "views/Browse/BrowseTournaments.jsx";
import {apolloClient} from "utils/index.js";
import {ApolloProvider} from "react-apollo";
import SignUpForm from "./views/SignUpForm/SignUpForm";

const hist = createBrowserHistory();

// Configure axios
axios.defaults.headers.common = {
    "Authorization": "Bearer " + localStorage.getItem("jwtToken")
};

ReactDOM.render(
    <ApolloProvider client={apolloClient}>
        <Header
            brand={<img src={require("assets/img/nacl.webp")} alt={"egge.gg"} style={{height: "40px"}}/>}
            fixed
            color="white"
            changeColorOnScroll={{
                height: 400,
                color: "white"
            }}
            history={hist}
        />
        <Router history={hist}>
            <Switch>
                <Route path="/tournament/:id" component={Tournament} history={hist}/>
                <Route path="/organize" component={Organize} history={hist}/>
                <Route path="/editUser" component={EditUserForm} history={hist}/>
                <Route path="/signUp" component={SignUpForm} history={hist}/>
                <Route path="/browse" component={Browse} history={hist}/>
                <Route
                    path="/browseTournaments/:gameId"
                    component={BrowseTournaments}
                    history={hist}
                />
                <Route path="/explore" component={LandingPage} history={hist}/>
                <Route path="/" component={LandingPage} history={hist}/>
            </Switch>
        </Router>
    </ApolloProvider>,
    document.getElementById("root")
);
