import React, { useEffect, useState } from "react";
import { IOrderItem, RESTAURANT_QUERY } from "../pages/client/restaurant";
import { getFragmentData, gql } from "../__generated__";
import { useApolloClient, useMutation } from "@apollo/client";
import { DISH_FRAGMENT } from "../fragments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { CreateOrderItem, CreateOrderMutation } from "../__generated__/graphql";
import { useHistory } from "react-router-dom";

interface IProps {
  restaurantId: number;
  isVisible: boolean;
  onClose: () => void;
  orderItems: IOrderItem[];
  setOrderItems: React.Dispatch<React.SetStateAction<IOrderItem[]>>;
}

const CREATE_ORDER_MUTATION = gql(`
  mutation createOrder ($restaurantId: Int!, $items: [CreateOrderItem!]!) {
    createOrder ( restaurantId: $restaurantId, items: $items ) {
      ok
      error
      orderId
    }
  }
`);

export const CheckoutModal: React.FC<IProps> = ({ restaurantId, isVisible, onClose, orderItems, setOrderItems }) => {
  const client = useApolloClient();
  const getCachedDish = (dishId: number) => {
    const cachedRestaurant = client.readQuery({ query: RESTAURANT_QUERY, variables: { restaurantId } });
    const menu = getFragmentData(DISH_FRAGMENT, cachedRestaurant?.restaurant.restaurant?.menu);
    const dish = menu?.find((dish) => dish.id === dishId);
    return dish;
  };
  const history = useHistory();
  const onCompleted = (data: CreateOrderMutation) => {
    const {
      createOrder: { ok, orderId },
    } = data;
    if (ok) {
      alert("Order created");
      history.push(`/orders/${orderId}`);
    }
  };
  const [creaetOrderMutaion] = useMutation(CREATE_ORDER_MUTATION, { onCompleted });
  const handleRemoveItem = (index: number) => {
    const removedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(removedItems);
  };
  const getSum = (items: IOrderItem[]) => {
    return items.reduce((totalAcc, item) => {
      if (item.options && item.options.length > 0) {
        const optionSum = item.options?.reduce((optionAcc, option) => {
          if (option.choices && option.choices.length > 0) {
            const choiceSum = option.choices.reduce((choiceAcc, choice) => {
              return choiceAcc + choice.extra;
            }, 0);
            return choiceSum + optionAcc;
          }
          return 0;
        }, 0);
        return optionSum + getCachedDish(item.dishId)!.price + totalAcc;
      }
      return totalAcc + getCachedDish(item.dishId)!.price;
    }, 0);
  };
  const [total, setTotal] = useState<number>();
  useEffect(() => {
    setTotal(getSum(orderItems)!);
  }, [total, orderItems]);
  const triggerCheckout = () => {
    creaetOrderMutaion({ variables: { restaurantId, items: orderItems as CreateOrderItem[] } });
    setOrderItems([]);
    onClose();
  };

  if (!isVisible) {
    return null;
  }
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50 bg-black bg-opacity-50 overflow-auto">
      <div className="opacity-100 my-20 bg-white w-2/5 items-stretch relative max-h-full">
        <div className="sticky top-0 z-10 bg-white">
          <button onClick={onClose} className="px-2 mt-3 ml-2">
            X
          </button>
        </div>
        <div className="flex flex-col min-h-44">
          {orderItems.length !== 0 ? (
            <div className="flex flex-col">
              <p className="font-medium pt-4 pl-4 text-2xl">Added Dishes</p>
              {orderItems.map((item, index) => (
                <div className={`mx-4 mt-2 ${index !== 0 && "border-t border-gray-600"}`} key={index}>
                  <div className="flex flex-row items-center justify-between pr-2">
                    <div className="pt-2">
                      <span className="font-medium text-lg">{getCachedDish(item.dishId)?.name}</span>
                      <span className=" ml-2">₩{getCachedDish(item.dishId)?.price}</span>
                    </div>
                    <button className="pt-2" onClick={() => handleRemoveItem(index)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  {item.options?.map((option, optionIndex) => (
                    <div className="pl-1 pt-1 my-1  border-t border-gray-300" key={`${index}-${optionIndex}`}>
                      <p className="font-medium">{option.name}</p>
                      {option.choices &&
                        option.choices.length > 0 &&
                        option.choices?.map((choice, choiceIndex) => (
                          <div key={`${index}-${optionIndex}-${choiceIndex}`}>
                            <span className="text-sm text-gray-800">{choice.name}</span>
                            <span className="text-xs text-gray-800 ml-2">₩{choice.extra}</span>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              ))}
              <div className="mx-4 pt-2 mt-3 border-t-2 border-black flex flex-row justify-between text-lg font-medium">
                <span>Total</span>
                <span>₩{total}</span>
              </div>
            </div>
          ) : (
            <p className="text-2xl my-auto mx-auto font-medium">Please add dish</p>
          )}
        </div>
        {orderItems.length > 0 && (
          <div className="sticky bottom-0 flex justify-end z-10 bg-white">
            <button type="submit" onClick={triggerCheckout} className="px-2 py-1 mr-3 my-3 bg-lime-500">
              Checkout Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
