import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { gql } from "../../__generated__";
import { useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useFieldArray, useForm, Control, UseFormRegister } from "react-hook-form";
import { Button } from "../../components/button";
import { MY_RESTAURANT } from "./my-restaurant";
import { DishOptionInputType } from "../../__generated__/graphql";

interface IParams {
  restaurantId: string;
}

interface IFormDishProps {
  name: string;
  price: string;
  description: string;
  file: FileList;
  options: DishOptionInputType[] | undefined;
}

const CREATE_DISH = gql(`
  mutation createDish ( $name: String!, $price: Int!, $photo: String!, $description: String!, $options: [DishOptionInputType!], $restaurantId: Int!) {
    createDish (name: $name, price:$price, photo: $photo, description: $description, options: $options, restaurantId: $restaurantId) {
      ok
      error
    }
  }
`);

const Choice = ({
  control,
  register,
  optionIndex,
}: {
  control: Control<IFormDishProps, any>;
  register: UseFormRegister<IFormDishProps>;
  optionIndex: number;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options.${index}.choices" as "options.0.choices",
  });
  const onAddChoiceClick = () => {
    append({ name: "" });
  };

  return (
    <div>
      <span className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5" onClick={onAddChoiceClick}>
        Add Choice Option
      </span>
      {fields.map((field, index) => (
        <div key={field.id} className="mt-5">
          <input
            type="text"
            placeholder="Choice Name"
            {...register(`options.${optionIndex}.choices.${index}.name`, {
              required: "Choice name is required",
              validate: (name) => name.trim() !== "",
            })}
          />
          <input
            type="number"
            placeholder="Extra"
            min={0}
            {...register(`options.${optionIndex}.choices.${index}.extra`, { required: true })}
          />
        </div>
      ))}
    </div>
  );
};

export const AddDish = () => {
  const history = useHistory();
  const { restaurantId } = useParams<IParams>();
  const [photoName, setPhotoName] = useState("Add Dish Image");
  const onCompleted = () => {
    history.push(`/restaurants/${restaurantId}`);
  };
  const [createDishMutation, { loading }] = useMutation(CREATE_DISH, {
    refetchQueries: [{ query: MY_RESTAURANT, variables: { id: +restaurantId } }],
    onCompleted,
  });
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
    control,
  } = useForm<IFormDishProps>({ mode: "onTouched", reValidateMode: "onBlur" });
  const { fields, append, update, remove } = useFieldArray({ control, name: "options" });
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setPhotoName(selectedFile ? selectedFile.name : "Add Dish Image");
  };
  const onSubmit = async () => {
    try {
      const { name, price, description, file, options } = getValues();
      const formBody = new FormData();
      formBody.append("file", file[0]);
      const { url } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();
      createDishMutation({
        variables: { name, price: +price, description, photo: url, restaurantId: +restaurantId, options },
      });
    } catch (error) {}
  };
  const onAddOptionClick = () => {
    append({ name: "", required: false, allowMultipleChoices: false, choices: [] });
  };

  // const data = useWatch({ control, name: "options" });
  // console.log(data);

  return (
    <div className="container w-full max-w-screen-sm flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3 text-center">Add Dish</h4>
      <form className="grid gap-3 my-5" onSubmit={handleSubmit(onSubmit)}>
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
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
          <span className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5" onClick={onAddOptionClick}>
            Add Dish Option
          </span>
          {fields.map((field, index) => (
            <div key={field.id} className="mt-5">
              <input
                type="text"
                placeholder="Option Name"
                {...register(`options.${index}.name`, {
                  required: "Option name is required",
                  validate: (name) => name.trim() !== "",
                })}
              />
              <div>
                <span className="mr-1">Mulitple Choices</span>
                <input type="checkbox" {...register(`options.${index}.allowMultipleChoices`)} />
                <span>{getValues(`options.${index}.allowMultipleChoices`)}</span>
              </div>
              <div>
                <span className="mr-1">Required</span>
                <input type="checkbox" {...register(`options.${index}.required`)} />
              </div>
              <Choice optionIndex={index} control={control} register={register} />
            </div>
          ))}
        </div>
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
            {...register("file", { required: "Dish image is required", onChange: handleFileChange })}
          />
        </label>
        <Button loading={loading} canClick={isValid} actionText="Create Dish" />
      </form>
    </div>
  );
};
