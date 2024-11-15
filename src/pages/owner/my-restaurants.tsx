import React from "react";
import { gql } from "../../__generated__";
import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";

export const MY_RESTAURANTS = gql(`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        name
        id
        isPromoted
        coverImg
        address
        category {
          name
          slug
        }
      }
    }
  }  
`);

export const MyRestaurants = () => {
  const { data } = useQuery(MY_RESTAURANTS);
  return (
    <div className="h-screen">
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      <div className="container mt-32">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font medium ">My Restaurants</h2>
          {data?.myRestaurants.ok && data?.myRestaurants.restaurants.length !== 0 && (
            <Link to={"/add-restaurant"} className="mr-8 text-white bg-gray-800 py-3 px-10">
              Add Restaurant &rarr;
            </Link>
          )}
        </div>
        {data?.myRestaurants.ok && data?.myRestaurants.restaurants.length === 0 ? (
          <div>
            <h4 className="text-xl mb-5">You have no restaurants</h4>
            <Link className="link" to="/add-restaurant">
              Create a restaurant &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.myRestaurants?.restaurants.map((restaurant) => {
              return (
                <Restaurant
                  key={restaurant.id}
                  id={restaurant.id + ""}
                  coverImg={restaurant.coverImg}
                  name={restaurant.name}
                  categoryName={restaurant.category.name}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
