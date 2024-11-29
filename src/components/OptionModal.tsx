import React from "react";
import { DishPartsFragment } from "../__generated__/graphql";

interface IFrops {
  isVisible: boolean;
  onClose?: () => void;
  dish: DishPartsFragment | undefined;
  orderItems: [];
  setOrderItems: React.Dispatch<React.SetStateAction<[]>>;
}

export const OptionModal: React.FC<IFrops> = ({ isVisible, onClose, dish, orderItems, setOrderItems }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50 bg-gray-100 bg-opacity-75 overflow-auto">
      <div className="opacity-100 my-20 bg-blue-100 w-3/5 items-stretch relative max-h-full">
        <div className="sticky top-0 z-10 bg-red-200">
          <button onClick={onClose} className="px-2 bg-lime-100">
            X
          </button>
        </div>
        <div className="grid grid-cols-[1fr_2fr] grid-rows-[auto]">
          <div style={{ backgroundImage: `url(${dish?.photo})` }} className="bg-cover bg-center aspect-square"></div>
          <div className="bg-green-300">이름 설명 가격</div>
          <div className="bg-white"></div>
          {dish?.options && dish.options.length > 0 && (
            <div className="bg-blue-300 col-start-2 col-end-3 row-start-2 row-end-3">
              {dish.options?.map((option, index) => <div key={index}>{option.name}</div>)}
            </div>
          )}
        </div>
        <div className="sticky bottom-0 flex justify-end z-10 bg-red-200">
          <button className="px-2 py-1 bg-lime-100">Add Orders</button>
        </div>
      </div>
    </div>
  );
};
