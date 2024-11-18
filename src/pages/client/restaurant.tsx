import React from "react";
import { Link, useParams } from "react-router-dom";
import { gql, getFragmentData } from "../../__generated__";
import { useQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { Helmet } from "react-helmet-async";

export const RESTAURANT_QUERY = gql(`
  query restaurant ($restaurantId: Int!) {
    restaurant (restaurantId: $restaurantId) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
`);

interface IRestaurantParams {
  id: string;
}

export const RestaurantDetail = () => {
  const params = useParams<IRestaurantParams>();
  const { data } = useQuery(RESTAURANT_QUERY, { variables: { restaurantId: +params.id } });
  const restaurant = getFragmentData(RESTAURANT_FRAGMENT, data?.restaurant.restaurant);

  return (
    <div>
      <Helmet>
        <title>Restaurant | Nuber Eats</title>
      </Helmet>
      <div className="py-40 bg-center bg-cover" style={{ backgroundImage: `url(${restaurant?.coverImg})` }}>
        <div className=" bg-white w-3/12 py-8 pl-20">
          <h4 className="text-4xl mb-3">{restaurant?.name}</h4>
          <Link to={`/category/${restaurant?.category.slug}`}>
            <h5 className="text-sm font-light hover:opacity-50 mb-2">{restaurant?.category.name}</h5>
          </Link>
          <h6 className="text-sm font-light">{restaurant?.address}</h6>
        </div>
      </div>
    </div>
  );
};
