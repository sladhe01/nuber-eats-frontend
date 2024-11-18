import React from "react";
import { Link } from "react-router-dom";

interface IDishProps {
  name: string;
  price: number;
  description: string;
  photo?: string | null;
  dishId: number;
  restaurantId: string;
}

export const Dish: React.FC<IDishProps> = ({ name, price, photo, description, dishId, restaurantId }) => {
  return (
    <div className="flex border hover:border-gray-800 transition-all">
      <div className=" px-8 pt-4 pb-8 basis-3/4 relative">
        <div>
          <h3 className="text-lg font-medium mb-5">{name}</h3>
          <h4 className="font-medium">{description}</h4>
        </div>
        <span className="text-sm">{price}₩</span>
        <Link
          to={`/restaurants/${restaurantId}/edit-dish/${dishId}`}
          className="text-white bg-lime-400 px-1 py-0.5 absolute top-4 right-4"
        >
          Edit Dish
        </Link>
      </div>
      <div style={{ backgroundImage: `url(${photo})` }} className="basis-1/4 bg-cover bg-center"></div>
    </div>
  );
};
