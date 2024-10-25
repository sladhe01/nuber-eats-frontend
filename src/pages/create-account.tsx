import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { useMutation } from "@apollo/client";
import { gql } from "../__generated__/gql";
import nuberLogo from "../images/nuber.svg";
import { Button } from "../components/button";
import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CreateAccountMutation, CreateAccountMutationVariables, UserRole } from "../__generated__/graphql";

const CREATE_ACCOUNT_MUTATION = gql(`
  mutation createAccount($email: String!, $password: String!, $role: UserRole!) {
    createAccount(email: $email, password: $password, role: $role) {
      ok
      error
    }
  }
`);

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const {
    register,
    getValues,
    watch,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ICreateAccountForm>({ reValidateMode: "onBlur", defaultValues: { role: UserRole.Client } });

  const history = useHistory();
  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (ok) {
      alert("Account created! Log in now!");
      history.push("/");
    }
  };

  const [createAccountMutation, { loading, data: createAccountMutationResult }] = useMutation<
    CreateAccountMutation,
    CreateAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION);

  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({ variables: { email, password, role }, onCompleted });
    }
  };
  console.log(watch());

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Create Account | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-5" />
        <h4 className="text-left font-medium w-full text-3xl mb-5">Let's get started</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3  mt-5 w-full mb-3">
          <input
            {...register("email", {
              required: "Email is required",
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            required
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && <FormError errorMessage={errors.email.message} />}
          {errors.email?.type === "pattern" && <FormError errorMessage="Please enter a valid email" />}
          <input
            {...register("password", { required: "Password is required" })}
            required
            type="password"
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && <FormError errorMessage={errors.password.message} />}
          {errors.password?.type === "minLength" && <FormError errorMessage="Password must be more than 10 chars" />}
          <select className="input" {...register("role", { required: true })}>
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button canClick={isValid} loading={loading} actionText="Create Account" />
          {createAccountMutationResult?.createAccount.error && (
            <FormError errorMessage={createAccountMutationResult.createAccount.error} />
          )}
        </form>
        <div>
          Aleady have an account?{" "}
          <Link to="/" className="text-lime-600 hover:underline">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};
