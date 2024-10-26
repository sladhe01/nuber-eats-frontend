import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CreateAccount } from "../pages/create-account";
import { Login } from "../pages/login";
import { NotFound } from "../pages/404";
import { ConfirmEmail } from "../pages/user/confirm-email";

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/create-account">
          <CreateAccount />
        </Route>
        <Route path="/" exact>
          <Login />
        </Route>
        <Route path="/confirm" exact>
          <ConfirmEmail />
        </Route>
        ,
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
