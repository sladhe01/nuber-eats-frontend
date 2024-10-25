import React from "react";
import { gql } from "../__generated__";
import { useQuery } from "@apollo/client";
import { Redirect, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";

const ClientRoutes = () => (
  <Route path="/" exact>
    <Restaurants />
  </Route>
);

const ME_QUERY = gql(`
  query me {
    me {
      id
      email
      role
      verified
    }
  }
  `);

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery(ME_QUERY);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Switch>{data.me.role === "Client" && <ClientRoutes />}</Switch>
      <Redirect to="/" />
    </Router>
  );
};
