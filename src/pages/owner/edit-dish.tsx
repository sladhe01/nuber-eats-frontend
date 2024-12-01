import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { gql, getFragmentData } from "../../__generated__";
import { useApolloClient, useLazyQuery, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useFieldArray, useForm, Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { Button } from "../../components/button";
import { MY_RESTAURANT } from "./my-restaurant";
import { DishOptionInputType, DishPartsFragment } from "../../__generated__/graphql";
import { FormError } from "../../components/form-error";
import { DISH_FRAGMENT } from "../../fragments";

interface IParams {
  restaurantId: string;
  dishId: string;
}

interface IFormDishProps {
  name: string;
  price: string;
  description: string;
  file: FileList;
  options: DishOptionInputType[] | undefined;
}

const EDIT_DISH = gql(`
  mutation editDish ( $name: String, $price: Int, $photo: String, $description: String, $options: [DishOptionInputType!], $dishId: Int!) {
    editDish (name: $name, price:$price, photo: $photo, description: $description, options: $options, dishId: $dishId) {
      ok
      error
    }
  }
`);

const GET_DISH = gql(`
  query getDish ( $id: Float!) {
    getDish ( id: $id ) {
      ok
      error
      dish {
        id
        name
        price
        description
        photo
        options {
          name
          allowMultipleChoices
          required
          choices {
            name
            extra
          }
        }
      }
    }
  }
`);

const Choice = ({
  control,
  register,
  optionIndex,
  errors,
  initialChoices,
}: {
  control: Control<IFormDishProps, any>;
  register: UseFormRegister<IFormDishProps>;
  optionIndex: number;
  errors: FieldErrors<IFormDishProps>;
  initialChoices?: { name: string; extra: number }[];
}) => {
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: `options.${optionIndex}.choices` as "options.0.choices",
  });
  const onAddChoiceClick = () => {
    append({ name: "" });
  };
  useEffect(() => {
    if (initialChoices && initialChoices.length > 0) {
      replace(
        initialChoices.map((choice) => {
          return { name: choice.name, extra: choice.extra };
        })
      );
    }
  }, [initialChoices]);

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

export const EditDish = () => {
  const { dishId, restaurantId } = useParams<IParams>();
  const client = useApolloClient();
  const queryResult = client.readQuery({ query: MY_RESTAURANT, variables: { id: +restaurantId } });
  const [callGetDishQuery, { data: getDishQueryResult, loading: getDishQueyrLoading }] = useLazyQuery(GET_DISH, {
    variables: { id: +dishId },
  });
  const [dish, setDish] = useState<DishPartsFragment | undefined | null>();
  const [photoName, setPhotoName] = useState("Edit Dish Image");
  const [fileChanged, setFileChanged] = useState(false);
  useEffect(() => {
    if (queryResult) {
      const menu = getFragmentData(DISH_FRAGMENT, queryResult?.myRestaurant.restaurant?.menu);
      const cachedDish = menu?.find((dish) => dish.id === +dishId);
      setDish(cachedDish);
    } else {
      callGetDishQuery();
    }
  }, []);

  useEffect(() => {
    if (getDishQueryResult) {
      const queryDish = getDishQueryResult.getDish.dish;
      setDish(queryDish);
    }
  }, [getDishQueryResult]);
  const history = useHistory();
  const onCompleted = () => {
    history.push(`/restaurants/${restaurantId}`);
  };
  const [editDishMutation, { loading }] = useMutation(EDIT_DISH, {
    refetchQueries: [{ query: MY_RESTAURANT, variables: { id: +restaurantId } }],
    onCompleted,
  });
  const {
    register,
    getValues,
    formState: { errors, isValid, dirtyFields, touchedFields },
    handleSubmit,
    control,
    reset,
  } = useForm<IFormDishProps>({
    mode: "onTouched",
    reValidateMode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({ control, name: "options" });
  useEffect(() => {
    if (dish) {
      reset({
        name: dish.name,
        price: `${dish.price}`,
        description: dish.description,
        options: dish.options?.map((option) => {
          return {
            name: option.name,
            allowMultipleChoices: option.allowMultipleChoices,
            required: option.allowMultipleChoices,
            choices: option.choices.map((choice) => {
              return { name: choice.name, extra: choice.extra };
            }),
          };
        }),
      });
    }
  }, [dish, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setPhotoName(selectedFile ? selectedFile.name : "Edit Dish Image");
    setFileChanged(true);
  };
  const onSubmit = async () => {
    try {
      const { name, price, description, file, options } = getValues();
      const changedName = name === dish?.name ? undefined : name;
      const changedPrice = price === String(dish?.price) ? undefined : +price;
      const changedDescription = description === dish?.description ? undefined : description;
      const changedOptions =
        JSON.stringify(options) ===
        JSON.stringify(
          dish?.options?.map((option) => {
            return {
              name: option.name,
              allowMultipleChoices: option.allowMultipleChoices,
              required: option.allowMultipleChoices,
              choices: option.choices.map((choice) => {
                return { name: choice.name, extra: choice.extra };
              }),
            };
          })
        )
          ? undefined
          : options;
      let url;
      if (fileChanged) {
        const formBody = new FormData();
        formBody.append("file", file[0]);
        const { url: imageUrl } = await (
          await fetch("http://localhost:4000/uploads/", {
            method: "POST",
            body: formBody,
          })
        ).json();
        url = imageUrl;
      }
      const variables = {
        name: changedName,
        price: changedPrice,
        description: changedDescription,
        photo: url,
        options: changedOptions,
      };
      if (!Object.values(variables).every((variable) => variable === undefined)) {
        editDishMutation({
          variables: { ...variables, dishId: +dishId },
        });
      } else {
        window.alert("Please edit at least one field");
      }
    } catch (error) {}
  };
  const onAddOptionClick = () => {
    append({
      name: "",
      required: false,
      allowMultipleChoices: false,
      choices: [],
    });
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
              <Choice
                optionIndex={index}
                control={control}
                register={register}
                errors={errors}
                initialChoices={dish?.options?.[index]?.choices}
              />
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
            {...register("file", {
              onChange: handleFileChange,
            })}
          />
        </label>
        {errors.file?.message && <FormError errorMessage={errors.file.message} />}
        <Button
          loading={loading}
          canClick={isValid && (Object.keys(touchedFields).length > 0 || fileChanged)}
          actionText="Edit Dish"
        />
      </form>
    </div>
  );
};
