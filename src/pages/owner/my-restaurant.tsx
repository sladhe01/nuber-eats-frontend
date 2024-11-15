import React from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { gql, useFragment } from "../../__generated__";
import { useQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragments";

const MY_RESTAURANT = gql(`
  query myRestaurant ($id: Float!) {
    myRestaurant (id: $id) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }`);

interface IParams {
  id: string;
}

export const MyRestaurant = () => {
  const { id } = useParams<IParams>();
  const { data, loading } = useQuery(MY_RESTAURANT, { variables: { id: +id } });
  const history = useHistory();
  const restaurant = useFragment(RESTAURANT_FRAGMENT, data?.myRestaurant.restaurant);
  if (data?.myRestaurant.error === "You can't access") {
    history.push("/unauthorized");
  }
  return (
    <div>
      <div
        className="bg-gray-700 py-28 bg-center bg-cover"
        style={{ backgroundImage: `url(${restaurant?.coverImg})` }}
      ></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">{(!loading && restaurant?.name) || "Loading..."}</h2>
        <div className="flex">
          <Link to={`/restaurants/${id}/add-dish`} className="mr-8 text-white bg-gray-800 py-3 px-10">
            Add Dish &rarr;
          </Link>
          <Link to={``} className="text-white bg-lime-700 py-3 px-10">
            Buy Promotion &rarr;
          </Link>
          <Link to={`/restaurants/${id}/edit-restaurant`} className="text-white bg-gray-800 py-3 px-10 ml-auto">
            Edit Restaurant &rarr;
          </Link>
        </div>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu?.length === 0 ? (
            <h4 className="text-xl mb-5">Please upload a dish!</h4>
          ) : null}
        </div>
      </div>
    </div>
  );
};
