import React from "react";
import { useMe } from "../../hooks/useMe";
import { Button } from "../../components/button";
import { useForm } from "react-hook-form";
import { gql } from "../../__generated__";
import { useApolloClient, useMutation } from "@apollo/client";
import { EditProfileMutation } from "../../__generated__/graphql";
import { FormError } from "../../components/form-error";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export const EDIT_PROFILE_MUTATION = gql(`
  mutation editProfile($email:String, $password:String) {
    editProfile(email: $email, password: $password) {
      ok
      error
    }
  }
`);

export const LOGIN_MUTATION = gql(`
  mutation logIn($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      error
      token
    }
  }
`);

interface IFormProps {
  email?: string;
  presentPassword: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: EditProfileMutation) => {
    const {
      editProfile: { ok },
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
  const [login, { data: loginResult }] = useMutation(LOGIN_MUTATION);
  const [editProfile, { data: editProfileResult, loading }] = useMutation(EDIT_PROFILE_MUTATION, { onCompleted });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<IFormProps>({ reValidateMode: "onBlur" });
  const onSubmit = async () => {
    if (userData) {
      const presentPassword = getValues("presentPassword");
      const {
        me: { email: presentEmail },
      } = userData;
      const { data } = await login({ variables: { email: presentEmail, password: presentPassword } });
      if (data?.login.ok) {
        //""->undefined로 바꿔주는 작업
        const { email, password } = Object.fromEntries(
          Object.entries(getValues()).filter(([_, value]) => value !== "")
        );
        await editProfile({ variables: { email, password } });
      }
    }
  };
  const validateAtLeastOne = (_: string | undefined, formValues: IFormProps) => {
    const { email, password } = formValues;
    return (email && email.trim() !== "") || (password && password.trim() !== "");
  };

  return (
    <div className="h-screen mt-52 flex flex-col justify-center items-center">
      <Helmet>
        <title>Edit Profile | Nuber Eats</title>
      </Helmet>
      <h4 className="text-center font-semibold text-2xl mb-3">Edit Profile</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
        <input
          {...register("presentPassword", {
            required: true,
          })}
          className="input"
          type="password"
          placeholder="Present Password"
        />
        {errors.presentPassword?.type === "required" && <FormError errorMessage="Please enter a present password" />}
        <input
          {...register("email", {
            pattern:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            validate: validateAtLeastOne,
          })}
          className="input"
          type="email"
          placeholder="New Email"
        />
        {errors.email?.type === "pattern" && <FormError errorMessage="Please enter a valid email" />}
        <input
          {...register("password", { validate: validateAtLeastOne })}
          className="input"
          type="password"
          placeholder="New Password"
        />
        <Button loading={loading} canClick={isValid} actionText="Save Profile" />
        {loginResult?.login.error && <FormError errorMessage={loginResult?.login.error} />}
        {!loginResult?.login.error && editProfileResult?.editProfile.error && (
          <FormError errorMessage={editProfileResult.editProfile.error} />
        )}
      </form>
    </div>
  );
};
