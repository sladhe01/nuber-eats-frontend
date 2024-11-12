import React from "react";
import { gql, useFragment } from "../../__generated__";
import { useQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const MY_RESTAURANTS = gql(`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }  
`);

export const MyRestaurants = () => {
  const { data } = useQuery(MY_RESTAURANTS);
  const restaurants = useFragment(RESTAURANT_FRAGMENT, data?.myRestaurants.restaurants);
  return (
    <div className="h-screen">
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      <div className="container mt-32">
        <h2 className="text-4xl font medium mb-10">My Restaurants</h2>
        {data?.myRestaurants.ok && data?.myRestaurants.restaurants.length === 0 && (
          <div>
            <h4 className="text-xl mb-5">You have no restaurants</h4>
            <Link className="link" to="/add-restaurant">
              Createe a restaurant &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
