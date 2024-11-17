import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { gql } from "../../__generated__";
import { useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useFieldArray, useForm, Control, UseFormRegister, FieldErrors, useWatch } from "react-hook-form";
import { Button } from "../../components/button";
import { MY_RESTAURANT } from "./my-restaurant";
import { DishOptionInputType } from "../../__generated__/graphql";
import { FormError } from "../../components/form-error";

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
  errors,
}: {
  control: Control<IFormDishProps, any>;
  register: UseFormRegister<IFormDishProps>;
  optionIndex: number;
  errors: FieldErrors<IFormDishProps>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options.${index}.choices" as "options.0.choices",
  });
  const onAddChoiceClick = () => {
    append({ name: "" });
  };

  return (
    <div className="w-full relative ">
      <span className="cursor-pointer text-white bg-gray-900 py-0.5 px-2 mt-2 inline-block" onClick={onAddChoiceClick}>
        Add Choice
      </span>
      {fields.map((field, index) => (
        <div key={field.id} className="mt-5 ml-10 flex flex-col items-start relative border-gray-200 border-t-2">
          <input
            type="text"
            placeholder="Choice Name"
            className="mt-2 mb-1 py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
            {...register(`options.${optionIndex}.choices.${index}.name`, {
              required: "Choice name is required",
              validate: (name) => name.trim() !== "",
            })}
          />
          {errors.options?.[optionIndex]?.choices?.[index]?.name?.message && (
            <FormError errorMessage={errors.options?.[optionIndex]?.choices?.[index]?.name?.message!} />
          )}
          <input
            type="number"
            placeholder="Extra"
            className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
            min={0}
            {...register(`options.${optionIndex}.choices.${index}.extra`, {
              required: true,
              setValueAs: (value) => Number(value),
            })}
          />
          {errors.options?.[optionIndex]?.choices?.[index]?.extra?.type === "required" && (
            <FormError errorMessage={"Extra is required"} />
          )}
          <span
            className="cursor-pointer text-white bg-orange-500 py-0.5 px-2 absolute top-1 right-0"
            onClick={() => {
              remove(index);
              fields.splice(index, 1);
            }}
          >
            Remove Choice
          </span>
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
      console.log(options);
      createDishMutation({
        variables: { name, price: +price, description, photo: url, restaurantId: +restaurantId, options },
      });
    } catch (error) {}
  };
  const onAddOptionClick = () => {
    append({ name: "", required: false, allowMultipleChoices: false, choices: [] });
  };

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
        {errors.name?.message && <FormError errorMessage={errors.name?.message} />}
        <input
          className="input"
          type="number"
          placeholder="Price"
          min={0}
          {...register("price", { required: "Price is required" })}
        />
        {errors.price?.message && <FormError errorMessage={errors.price?.message} />}
        <input
          className="input"
          type="text"
          placeholder="Description"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description?.message && <FormError errorMessage={errors.description?.message} />}
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
          <span className="cursor-pointer text-white bg-gray-900 py-0.5 px-2 inline-block" onClick={onAddOptionClick}>
            Add Dish Option
          </span>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="mt-5 flex flex-col items-start relative border-b-2 border-solid border-gray-500 pb-2"
            >
              <input
                type="text"
                placeholder="Option Name"
                className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
                {...register(`options.${index}.name`, {
                  required: "Option name is required",
                  validate: (name) => name.trim() !== "",
                })}
              />
              {errors.options?.[index]?.name?.message && (
                <FormError errorMessage={errors.options?.[index]?.name?.message!} />
              )}
              <div>
                <span className="mr-1">Mulitple Choices</span>
                <input type="checkbox" {...register(`options.${index}.allowMultipleChoices`)} />
                <span>{getValues(`options.${index}.allowMultipleChoices`)}</span>
              </div>
              <div>
                <span className="mr-1">Required</span>
                <input type="checkbox" {...register(`options.${index}.required`)} />
              </div>
              <span
                className="cursor-pointer text-white bg-orange-500 py-0.5 px-2 absolute top-0 right-0"
                onClick={() => {
                  remove(index);
                  fields.splice(index, 1);
                }}
              >
                Remove Option
              </span>
              <Choice optionIndex={index} control={control} register={register} errors={errors} />
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
        {errors.file?.message && <FormError errorMessage={errors.file.message} />}
        <Button loading={loading} canClick={isValid} actionText="Create Dish" />
      </form>
    </div>
  );
};
