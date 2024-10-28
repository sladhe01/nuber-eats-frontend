import React, { useEffect } from "react";
import { gql } from "../../__generated__";
import { useApolloClient, useMutation } from "@apollo/client";
import { VerifyEmailMutation } from "../../__generated__/graphql";
import { useMe } from "../../hooks/useMe";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const VERIFY_EMAIL_MUTATION = gql(`
  mutation verifyEmail ($code:String!) {
    verifyEmail(code:$code) {
      ok
      error
    }
  }
`);

export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: VerifyEmailMutation) => {
    const {
      verifyEmail: { ok, error },
    } = data;
    if (ok && userData?.me) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql(`
        fragment VerifiedUser on User {verified}`),
        data: { verified: true },
      });
    }
    history.push("/");
  };
  const [verifyEmail] = useMutation(VERIFY_EMAIL_MUTATION);
  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    verifyEmail({ variables: { code }, onCompleted });
  }, []);
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Verify Eamil | Nuber Eats</title>
      </Helmet>
      <h2 className="text-lg mb-1 font-medium ">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">Please wait, don't close this page</h4>
    </div>
  );
};
