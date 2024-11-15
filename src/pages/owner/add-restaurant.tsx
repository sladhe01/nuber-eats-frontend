import React, { useState } from "react";
import { gql } from "../../__generated__";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Helmet } from "react-helmet-async";
import { FormError } from "../../components/form-error";
import { CreateRestaurantMutation, MyRestaurantsQuery } from "../../__generated__/graphql";
import { useHistory } from "react-router-dom";
import { MY_RESTAURANTS } from "./my-restaurants";

const CREATE_RESTAURANT = gql(`
  mutation createRestaurant ( $name: String!, $coverImg: String!, $address: String!, $categoryName: String!) {
    createRestaurant (name: $name, coverImg: $coverImg, address: $address, categoryName: $categoryName) {
      ok
      error
      restaurantId
    }
  }
`);

export const ALL_CATEGORIES = gql(`
  query allCategories {
    allCategories {
      ok
      error
      categories {
        id
        name
        slug
      }
    }
  }
`);

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const { data: allCategoriesQueryResult, loading: allCategoriesQueryLoading } = useQuery(ALL_CATEGORIES);
  const categories = allCategoriesQueryResult?.allCategories.categories;
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState("");
  const client = useApolloClient();
  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      const { name, categoryName, address } = getValues();
      const categorySlug = categories?.find((category) => category.name === categoryName)?.slug;
      setUploading(false);
      const queryResult = client.readQuery({ query: MY_RESTAURANTS });
      if (queryResult) {
        client.writeQuery<MyRestaurantsQuery>({
          query: MY_RESTAURANTS,
          data: {
            myRestaurants: {
              ...queryResult?.myRestaurants,
              restaurants: [
                {
                  __typename: "Restaurant",
                  name,
                  id: restaurantId!,
                  isPromoted: false,
                  coverImg: imageUrl,
                  address,
                  category: { __typename: "Category", name: categoryName, slug: categorySlug! },
                },
                ...queryResult.myRestaurants.restaurants,
              ],
            },
          },
        });
      }
      history.push("/");
    }
  };
  const [createRestaurantMutation, { data: createRestaurantMutationResult }] = useMutation(CREATE_RESTAURANT, {
    onCompleted,
  });
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IFormProps>({ mode: "onTouched", reValidateMode: "onBlur" });
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("Add Restaurant Image");
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { name, categoryName, address, file } = getValues();
      const formBody = new FormData();
      formBody.append("file", file[0]);
      const { url } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();
      setImageUrl(url);
      createRestaurantMutation({ variables: { name, categoryName, address, coverImg: url } });
    } catch (e) {}
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFileName(selectedFile ? selectedFile.name : "Add Restaurant Image");
  };

  return (
    <div className="container w-full max-w-screen-sm flex flex-col px-5 items-center">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h4 className="font-medium w-full text-3xl my-5 text-center">Add Restaurant</h4>
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
            <option key={0} value={undefined}>
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
          <label
            tabIndex={0}
            htmlFor="file"
            className="w-1/3 text-sm text-center cursor-pointer hover:border-gray-500 truncate input"
          >
            {fileName}
            <input
              className="hidden"
              id="file"
              type="file"
              accept="image/*"
              {...register("file", { required: "Restaurant image is required", onChange: handleFileChange })}
            />
          </label>
          {errors.file?.message && <FormError errorMessage={errors.file.message} />}
          <Button loading={allCategoriesQueryLoading && uploading} canClick={isValid} actionText="Create Restaurant" />
          {createRestaurantMutationResult?.createRestaurant.error && (
            <FormError errorMessage={createRestaurantMutationResult.createRestaurant.error} />
          )}
        </form>
      )}
    </div>
  );
};
