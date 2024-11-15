import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { gql } from "../../__generated__";
import { useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";

interface IParams {
  restaurantId: string;
}

const CREATE_DISH = gql(`
  mutation createDish ( $name: String!, $price: Int!, $photo: String!, $description: String!, $options: [DishOptionInputType!], $restaurantId: Int!) {
    createDish (name: $name, price:$price, photo: $photo, description: $description, options: $options, restaurantId: $restaurantId) {
      ok
      error
    }
  }
`);

export const AddDish = () => {
  const { restaurantId } = useParams<IParams>();
  const [photoName, setPhotoName] = useState("Add Dish Photo");
  const [createDishMutation, { loading }] = useMutation(CREATE_DISH);
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({ mode: "onTouched", reValidateMode: "onBlur" });
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setPhotoName(selectedFile ? selectedFile.name : "Add Dish Photo");
  };

  return (
    <div className="container w-full max-w-screen-sm flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3 text-center">Add Dish</h4>
      <form className="grid gap-3 my-5">
        <input
          className="input"
          type="text"
          placeholder="Name"
          {...register("name", { required: "Name is required" })}
        />
        <input
          className="input"
          type="number"
          placeholder="Price"
          min={0}
          {...register("price", { required: "Price is required" })}
        />
        <input
          className="input"
          type="text"
          placeholder="Description"
          {...register("description", { required: "Description is required" })}
        />
        <span>options</span>
        <label
          tabIndex={0}
          htmlFor="file"
          className="w-1/3 text-sm text-center cursor-pointer hover:border-gray-500 truncate input"
        >
          {photoName}
          <input
            className="hidden"
            id="file"
            type="file"
            accept="image/*"
            {...register("file", { required: "Dish photo is required", onChange: handleFileChange })}
          />
        </label>
        <Button loading={loading} canClick={isValid} actionText="Create Dish" />
      </form>
    </div>
  );
};
