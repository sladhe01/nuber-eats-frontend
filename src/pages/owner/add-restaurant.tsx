import React from "react";
import { gql } from "../../__generated__";
import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Helmet } from "react-helmet-async";
import { FormError } from "../../components/form-error";

const CREATE_RESTAURANT = gql(`
  mutation createRestaurant ( $name: String!, $coverImg: String!, $address: String!, $categoryName: String!) {
    createRestaurant (name: $name, coverImg: $coverImg, address: $address, categoryName: $categoryName) {
      ok
      error
    }
  }
`);

const ALL_CATEGORIES = gql(`
  query allCategories {
    allCategories {
      ok
      error
      categories {
        id
        name
      }
    }
  }
`);

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
}

export const AddRestaurant = () => {
  const { data: allCategoriesQueryResult, loading: allCategoriesQueryLoading } = useQuery(ALL_CATEGORIES);
  const categories = allCategoriesQueryResult?.allCategories.categories;
  const [createRestaurantMutation, { loading: createRestaurantMutationLoading, data: createRestaurantMutationResult }] =
    useMutation(CREATE_RESTAURANT);
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IFormProps>({ mode: "onTouched", reValidateMode: "onBlur" });
  const onSubmit = () => {
    console.log(getValues());
  };

  return (
    <div className="container w-full max-w-screen-sm flex flex-col px-5 items-center">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h4 className="text-left font-medium w-full text-3xl my-5">Add Restaurant</h4>
      {categories && !allCategoriesQueryLoading && (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3  mt-5 w-full mb-3">
          <input
            type="text"
            placeholder="Name"
            {...register("name", { required: "Name is required" })}
            className="input"
          />
          {errors.name?.message && <FormError errorMessage={errors.name.message} />}
          <select className="input" {...register("categoryName", { required: true, validate: (v) => v !== "Select" })}>
            <option selected key={0} value={undefined}>
              Select
            </option>
            {categories.map((category, index) => {
              return <option key={index++}>{category.name}</option>;
            })}
          </select>
          <input
            type="text"
            placeholder="Address"
            {...register("address", { required: "Address is required" })}
            className="input"
          />
          {errors.address?.message && <FormError errorMessage={errors.address.message} />}
          <Button
            loading={allCategoriesQueryLoading && createRestaurantMutationLoading}
            canClick={isValid}
            actionText="Create Restaurant"
          />
          {createRestaurantMutationResult?.createRestaurant.error && (
            <FormError errorMessage={createRestaurantMutationResult.createRestaurant.error} />
          )}
        </form>
      )}
    </div>
  );
};
