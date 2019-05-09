import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import "assets/scss/material-kit-react.scss?v=1.4.0";

// pages for this product
import Components from "views/Components/Components.jsx";
import Tournament from "views/Components/Tournament/Tournament.jsx";
import Organize from "views/Components/Organize.jsx";
import EditUserForm from "views/Components/EditUserForm.jsx";
import Browse from "views/Components/Browse.jsx";
import BrowseTournaments from "views/Components/BrowseTournaments.jsx";
import { apolloClient } from "utils/index.js";
import { ApolloProvider } from "react-apollo";

var hist = createBrowserHistory();

// Configure axios
axios.defaults.headers.common = {
  "Authorization": "Bearer " + localStorage.getItem("jwtToken")
};

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
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
        <Route path="/" component={Components} />
      </Switch>
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
