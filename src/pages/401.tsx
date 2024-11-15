import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export const Unauthorized = () => (
  <div className="h-screen flex flex-col justify-center items-center">
    <Helmet>
      <title>Unauthorized | Nuber Eats</title>
    </Helmet>
    <h2 className="font-semibold text-2xl mb-3">Unauthorized access</h2>
    <h4 className="font-medium text-base mb-5">You don't have permission to access this page</h4>
    <Link className="link" to="/">
      Go back home &rarr;
    </Link>
  </div>
);
