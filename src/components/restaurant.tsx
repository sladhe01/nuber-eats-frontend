import React from "react";
import { Link } from "react-router-dom";

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({ coverImg, name, categoryName, id }) => {
  return (
    <Link to={`/restaurants/${id}`}>
      <div className="flex flex-col">
        <div style={{ backgroundImage: `url(${coverImg})` }} className="bg-cover bg-center py-28 mb-3"></div>
        <h3 className="text-xl font-medium">{name}</h3>
        <span className="border-t-2 mt-2 py-2 text-xs opacity-50 border-gray-400">{categoryName}</span>
      </div>
    </Link>
  );
};
