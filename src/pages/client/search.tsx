import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useHistory, useLocation } from "react-router-dom";
import { gql, useFragment } from "../../__generated__";
import { useLazyQuery } from "@apollo/client";
import { RestaurantPartsFragment } from "../../__generated__/graphql";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";

export const SEARCH_RESTAURANT = gql(`
  query searchRestaurant ($query: String!, $page: Int) {
    searchRestaurant (query:$query, page:$page) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
`);

export const Search = () => {
  const location = useLocation();
  const history = useHistory();
  const [callQuery, { loading, data }] = useLazyQuery(SEARCH_RESTAURANT);
  const [page, setPage] = useState(1);
  const onNextPageClick = () => {
    setPage((current) => current + 1);
  };
  const onPrevPageClick = () => {
    setPage((current) => current - 1);
  };
  const restaurants = useFragment(RESTAURANT_FRAGMENT, data?.searchRestaurant.restaurants);
  const query = location.search.split("?term=")[1];
  useEffect(() => {
    if (!query) {
      return history.replace("/");
    }
    callQuery({ variables: { query, page: 1 } });
  }, [history, location]);
  return (
    <div className="h-screen">
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      {!loading ? (
        data?.searchRestaurant.error === "Not found restaurant" ? (
          <div className="h-screen flex flex-col justify-center items-center">
            <h2 className="font-semibold text-2xl mb-3">{`We didt't find a match for ${query}`}</h2>
            <h4 className="font-medium text-base mb-5">Try searching for something else instead</h4>
            <Link className="link" to="/">
              View all &rarr;
            </Link>
          </div>
        ) : (
          <div className="container pb-20  mt-8">
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {restaurants?.map((restaurant: RestaurantPartsFragment) => {
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
            <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
              {page > 1 ? (
                <button onClick={onPrevPageClick} className="focus:outline-none font-medium text-2xl">
                  &larr;
                </button>
              ) : (
                <div></div>
              )}
              <span>
                Page {page} of {data?.searchRestaurant.totalPages}
              </span>
              {page !== data?.searchRestaurant.totalPages ? (
                <button onClick={onNextPageClick} className="focus:outline-none font-medium text-2xl">
                  &rarr;
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        )
      ) : null}
    </div>
  );
};
