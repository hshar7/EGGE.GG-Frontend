import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.4.0";

// pages for this product
import Components from "views/Components/Components.jsx";
import Tournament from "views/Components/Tournament.jsx";
import Organize from "views/Components/Organize.jsx";
import EditUserForm from "views/Components/EditUserForm.jsx";

var hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/tournament/:id" component={Tournament} />
      <Route path="/organize" component={Organize} />
      <Route path="/editUser" component={EditUserForm} />
      <Route path="/" component={Components} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
