import React, { useState } from "react";
import { gql } from "../../__generated__";
import { useMutation, useQuery } from "@apollo/client";
import { ALL_CATEGORIES } from "./add-restaurant";
import { Helmet } from "react-helmet-async";
import { useForm, Validate } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { EditRestaurantMutation } from "../../__generated__/graphql";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";

export const EDIT_RESTAURANT_MUTATION = gql(`
  mutation editRestaurant ($name: String, $coverImg: String, $address: String, $categoryName: String, $restaurantId: Float!) {
    editRestaurant (name:$name, coverImg:$coverImg, address: $address, categoryName: $categoryName, restaurantId: $restaurantId) {
      ok
      error
    }
  } 
`);

interface IParams {
  id: string;
}

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const EditRestaurant = () => {
  const { id } = useParams<IParams>();
  const { data: allCategoriesQueryResult, loading: allCategoriesQueryLoading } = useQuery(ALL_CATEGORIES);
  const categories = allCategoriesQueryResult?.allCategories.categories;
  const history = useHistory();
  const onCompleted = (data: EditRestaurantMutation) => {
    if (data.editRestaurant.error === "You can't edit a restaurant that you don't own") {
      history.push("/unauthorized");
    }
    history.push("/");
  };
  const [editRestaurantMutation, { data: editRestaurantMutationResult }] = useMutation(EDIT_RESTAURANT_MUTATION, {
    onCompleted,
  });
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IFormProps>({ mode: "onTouched", reValidateMode: "onBlur" });
  const [uploading, setUploading] = useState(false);
  const onSubmit = async () => {
    try {
      setUploading(true);
      const formBody = new FormData();
      const file = getValues("file");
      let imageUrl;
      if (file.length !== 0) {
        formBody.append("file", file[0]);
        const { url } = await (
          await fetch("http://localhost:4000/uploads/", {
            method: "POST",
            body: formBody,
          })
        ).json();
        imageUrl = url;
      }
      const { name, address } = Object.fromEntries(Object.entries(getValues()).filter(([_, value]) => value !== ""));
      let categoryName;
      categoryName = getValues("categoryName");
      if (categoryName === "Select") {
        categoryName = undefined;
      }
      editRestaurantMutation({ variables: { name, categoryName, address, coverImg: imageUrl, restaurantId: +id } });
    } catch (e) {}
  };
  const [fileName, setFileName] = useState("Add Restaurant Image");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFileName(selectedFile ? selectedFile.name : "Add Restaurant Image");
  };
  const validateAtLeastOne: Validate<FileList | string | undefined, IFormProps> = (_, formValues: IFormProps) => {
    const { name, categoryName, address, file } = formValues;
    return (
      (name && name.trim() !== "") ||
      (address && address.trim() !== "") ||
      categoryName !== "Select" ||
      (file && file.length !== 0)
    );
  };

  return (
    <div className="container w-full max-w-screen-sm flex flex-col px-5 items-center">
      <Helmet>
        <title>Edit Restaurant | Nuber Eats</title>
      </Helmet>
      <h4 className="font-medium w-full text-3xl my-5 text-center">Add Restaurant</h4>
      {categories && !allCategoriesQueryLoading && (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3  mt-5 w-full mb-3">
          <input
            type="text"
            placeholder="Name"
            {...register("name", { validate: validateAtLeastOne })}
            className="input"
          />
          <select className="input" {...register("categoryName")}>
            <option key={0}>Select</option>
            {categories.map((category, index) => {
              return <option key={index++}>{category.name}</option>;
            })}
          </select>
          <input
            type="text"
            placeholder="Address"
            {...register("address", { validate: validateAtLeastOne })}
            className="input"
          />
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
              {...register("file", { onChange: handleFileChange, validate: validateAtLeastOne })}
            />
          </label>
          {errors.file?.message && <FormError errorMessage={errors.file.message} />}
          <Button loading={allCategoriesQueryLoading && uploading} canClick={isValid} actionText="Edit Restaurant" />
          {editRestaurantMutationResult?.editRestaurant.error && (
            <FormError errorMessage={editRestaurantMutationResult.editRestaurant.error} />
          )}
        </form>
      )}
    </div>
  );
};
