import React from "react";
import { IOrderItem } from "../pages/client/restaurant";

interface IProps {
  isVisible: boolean;
  onClose: () => void;
  orderItems: IOrderItem[];
  setOrderItems: React.Dispatch<React.SetStateAction<IOrderItem[]>>;
}

//todo
//mutation 까지 넣어야함
//css 배치
//주문 완료하면 orderItems 초기화
export const CheckoutModal: React.FC<IProps> = ({ isVisible, onClose, orderItems, setOrderItems }) => {
  const handleRemoveItem = (index: number) => {
    const removedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(removedItems);
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
              <p className="font-medium pt-4 pl-4 text-xl">Added Dishes</p>
              {orderItems.map((item, index) => (
                <div key={index}>
                  <div className="flex flex-row justify-between pr-4">
                    <p>{item.dish?.name}</p>
                    <button onClick={() => handleRemoveItem(index)}>Bin</button>
                  </div>
                  {item.options?.map((option, optionIndex) => (
                    <div key={`${index}-${optionIndex}`}>
                      <p>
                        {option.name}
                        {"Option Name"}
                      </p>
                      {option.choices?.map((choice, choiceIndex) => (
                        <div key={`${index}-${optionIndex}-${choiceIndex}`}>
                          <span>{choice.name}</span>
                          <span>{choice.extra}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-2xl my-auto mx-auto font-medium">Please add dish</p>
          )}
        </div>
        <div className="sticky bottom-0 flex justify-end z-10 bg-white">
          <button type="submit" className="px-2 py-1 mr-3 my-3 bg-lime-500">
            Checkout Orders
          </button>
        </div>
      </div>
    </div>
  );
};
