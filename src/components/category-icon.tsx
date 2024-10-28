import React from "react";

interface ICategoryProps {
  coverImg: string;
  name: string;
}

export const CategoryIcon: React.FC<ICategoryProps> = ({ coverImg, name }) => {
  return (
    <div className="flex flex-col group items-center cursor-pointer">
      <div
        className="w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
        style={{ backgroundImage: `url(${coverImg})` }}
      ></div>
      <span className="mt-1 text-sm text-center font-medium">{name}</span>
    </div>
  );
};
