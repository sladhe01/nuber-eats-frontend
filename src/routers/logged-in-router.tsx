import React from "react";
import { Redirect, Route, BrowserRouter as Router, Switch, useLocation } from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { isLoggedInVar } from "../apollo";
import { EditProfile } from "../pages/user/edit-profile";
import { Search } from "../pages/client/search";
import { Category } from "../pages/client/category";
import { RestaurantDetail } from "../pages/client/restaurant";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { AddRestaurant } from "../pages/owner/add-restaurant";

const clientRoutes = [
  { path: "/", component: <Restaurants /> },
  { path: "/search", component: <Search /> },
  { path: "/category/:slug", component: <Category /> },
  { path: "/restaurants/:id", component: <RestaurantDetail /> },
];

const restaurantRoutes = [
  { path: "/", component: <MyRestaurants /> },
  { path: "/add-restaurant", component: <AddRestaurant /> },
];

const commonRoutes = [
  { path: "/confirm", component: <ConfirmEmail /> },
  { path: "/edit-profile", component: <EditProfile /> },
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    if (error?.message === "Forbidden resource") {
      localStorage.removeItem(LOCALSTORAGE_TOKEN);
      isLoggedInVar(false);
    }
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === "Client" &&
          clientRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact>
              {route.component}
            </Route>
          ))}
        {data.me.role === "Owner" &&
          restaurantRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact>
              {route.component}
            </Route>
          ))}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} exact>
            {route.component}
          </Route>
        ))}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
