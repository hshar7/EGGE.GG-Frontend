import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import "assets/scss/material-kit-react.scss?v=1.4.0";
import Header from "components/Header/Header.jsx";
// pages for this product
import Components from "views/LandingPage/LandingPage.jsx";
import Tournament from "views/Tournament/Tournament.jsx";
import Organize from "views/Components/Organize.jsx";
import EditUserForm from "views/EditUserForm/EditUserForm.jsx";
import Browse from "views/Components/Browse.jsx";
import BrowseTournaments from "views/Components/BrowseTournaments.jsx";
import Organization from "views/Organization/Organization.jsx";
import { apolloClient } from "utils/index.js";
import { ApolloProvider } from "react-apollo";

var hist = createBrowserHistory();

// Configure axios
axios.defaults.headers.common = {
  "Authorization": "Bearer " + localStorage.getItem("jwtToken")
};

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <Header
        brand={<img src={require("assets/img/logo.svg")} alt={"egge.gg"} />}
        fixed
        color="white"
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
    />
    <Router history={hist}>
      <Switch>
        <Route path="/tournament/:id" component={Tournament} />
        <Route path="/organize" component={Organize} />
        <Route path="/editUser" component={EditUserForm} />
        <Route path="/browse" component={Browse} />
        <Route
          path="/browseTournaments/:gameId"
          component={BrowseTournaments}
        />
          <Route path="/organization/:organizationId" component={Organization} />
          <Route path="/" component={Components} />
      </Switch>
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
