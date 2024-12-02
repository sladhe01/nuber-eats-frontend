import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { gql, getFragmentData } from "../../__generated__";
import { useQuery } from "@apollo/client";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { Helmet } from "react-helmet-async";
import { Dish } from "../../components/dish";
import { OptionModal } from "../../components/OptionModal";
import { DishPartsFragment, DishChoice } from "../../__generated__/graphql";
import { useForm } from "react-hook-form";
import { CheckoutModal } from "../../components/CheckoutModal";

export const RESTAURANT_QUERY = gql(`
  query restaurant ($restaurantId: Int!) {
    restaurant (restaurantId: $restaurantId) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
`);

interface IRestaurantParams {
  id: string;
}

export interface IFormOrderItem {
  optionIndex_choiceIndex?: string[];
}

export interface IOption {
  name: string;
  choices?: DishChoice[];
}

export interface IOrderItem {
  dishId: number;
  options?: IOption[];
}

export const RestaurantDetail = () => {
  const params = useParams<IRestaurantParams>();
  const { data } = useQuery(RESTAURANT_QUERY, { variables: { restaurantId: +params.id } });
  const restaurant = getFragmentData(RESTAURANT_FRAGMENT, data?.restaurant.restaurant);
  const menu = getFragmentData(DISH_FRAGMENT, data?.restaurant?.restaurant?.menu);
  const [isOptionModalVisible, setIsOptionModalVisible] = useState(false);
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);
  const [selectedDish, setSelectedDish] = useState<DishPartsFragment | undefined>();
  const openOptionModal = (dish: DishPartsFragment) => {
    setSelectedDish(dish);
    setIsOptionModalVisible(true);
  };
  const closeOptionModal = () => {
    setSelectedDish(undefined);
    setIsOptionModalVisible(false);
  };
  const openCheckoutModal = () => {
    setIsCheckoutModalVisible(true);
  };
  const closeCheckoutModal = () => {
    setIsCheckoutModalVisible(false);
  };

  useEffect(() => {
    if (isOptionModalVisible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOptionModalVisible]);

  //테스트용
  useEffect(() => {
    console.log("orderItems", orderItems);
  }, [orderItems]);
  return (
    <div>
      <Helmet>
        <title>Restaurant | Nuber Eats</title>
      </Helmet>
      <OptionModal
        isVisible={isOptionModalVisible}
        dish={selectedDish}
        setOrderItems={setOrderItems}
        onClose={closeOptionModal}
      />
      <CheckoutModal
        restaurantId={+params.id}
        isVisible={isCheckoutModalVisible}
        onClose={closeCheckoutModal}
        orderItems={orderItems}
        setOrderItems={setOrderItems}
      />
      <div className="py-40 bg-center bg-cover" style={{ backgroundImage: `url(${restaurant?.coverImg})` }}>
        <div className=" bg-white w-3/12 py-8 pl-20">
          <h4 className="text-4xl mb-3">{restaurant?.name}</h4>
          <Link to={`/category/${restaurant?.category.slug}`}>
            <h5 className="text-sm font-light hover:opacity-50 mb-2">{restaurant?.category.name}</h5>
          </Link>
          <h6 className="text-sm font-light">{restaurant?.address}</h6>
        </div>
      </div>
      <div className="container flex flex-col items-end mt-20">
        <button
          onClick={openCheckoutModal}
          className="text-lg font-medium focus:outline-none text-white py-4 transition-colors bg-lime-600 hover:bg-lime-700 px-10"
        >
          Checkout Order
        </button>
        <div className="grid w-full mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
          {menu?.map((dish, index) => (
            <div key={index}>
              <Dish
                name={dish.name}
                price={dish.price}
                description={dish.description}
                photo={dish.photo}
                restaurantId={params.id}
                dishId={dish.id}
                role="Client"
                onClick={() => openOptionModal(dish)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
