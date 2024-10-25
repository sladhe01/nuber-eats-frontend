import React from "react";
import { useMe } from "../../hooks/useMe";
import { Button } from "../../components/button";
import { useForm } from "react-hook-form";
import { gql } from "../../__generated__";
import { useApolloClient, useMutation } from "@apollo/client";
import { EditProfileMutation } from "../../__generated__/graphql";
import { FormError } from "../../components/form-error";
import { useHistory } from "react-router-dom";

const EDIT_PROFILE_MUTATION = gql(`
  mutation editProfile($email:String, $password:String) {
    editProfile(email: $email, password: $password) {
      ok
      error
    }
  }
`);

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: EditProfileMutation) => {
    const {
      editProfile: { ok, error },
    } = data;
    if (ok && userData) {
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail && newEmail && newEmail !== "") {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql(`
            fragment EditedUser on User {
              verified
              email}
            `),
          data: { verified: false, email: newEmail },
        });
      }
      history.push("/");
    }
  };
  const [editProfile, { data: editProfileResult, loading }] = useMutation(EDIT_PROFILE_MUTATION, { onCompleted });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<IFormProps>({ reValidateMode: "onBlur" });
  const onSubmit = () => {
    //""->undefined로 바꿔주는 작업
    const { email, password } = Object.fromEntries(Object.entries(getValues()).filter(([_, value]) => value !== ""));
    editProfile({ variables: { email, password } });
  };
  const validateAtLeastOne = (_: string | undefined, formValues: IFormProps) => {
    const { email, password } = formValues;
    return (email && email.trim() !== "") || (password && password.trim() !== "");
  };

  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
        <input
          {...register("email", {
            pattern:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            validate: validateAtLeastOne,
          })}
          className="input"
          type="email"
          placeholder="Email"
        />
        {errors.email?.type === "pattern" && <FormError errorMessage="Please enter a valid email" />}

        <input
          {...register("password", { validate: validateAtLeastOne })}
          className="input"
          type="password"
          placeholder="Password"
        />
        <Button loading={loading} canClick={isValid} actionText="Save Profile" />
        {editProfileResult?.editProfile.error && <FormError errorMessage={editProfileResult.editProfile.error} />}
      </form>
    </div>
  );
};
