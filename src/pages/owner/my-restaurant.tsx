import React from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { gql, getFragmentData } from "../../__generated__";
import { useQuery } from "@apollo/client";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { Dish } from "../../components/dish";

export const MY_RESTAURANT = gql(`
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
  const restaurant = getFragmentData(RESTAURANT_FRAGMENT, data?.myRestaurant.restaurant);
  const menu = getFragmentData(DISH_FRAGMENT, data?.myRestaurant.restaurant?.menu);
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
          ) : (
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {menu?.map((dish, index) => (
                <Dish
                  key={index}
                  name={dish.name}
                  price={dish.price}
                  description={dish.description}
                  photo={dish.photo}
                  restaurantId={id}
                  dishId={dish.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
