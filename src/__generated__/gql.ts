/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  query me {\n    me {\n      id\n      email\n      role\n      verified\n    }\n  }\n  ": types.MeDocument,
    "\n  mutation createAccount($email: String!, $password: String!, $role: UserRole!) {\n    createAccount(email: $email, password: $password, role: $role) {\n      ok\n      error\n    }\n  }\n": types.CreateAccountDocument,
    "\n  mutation logIn($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      ok\n      error\n      token\n    }\n  }\n": types.LogInDocument,
    "\n  mutation verifyEmail ($code:String!) {\n    verifyEmail(code:$code) {\n      ok\n      error\n    }\n  }\n": types.VerifyEmailDocument,
    "\n        fragment VerifiedUser on User {verified}": types.VerifiedUserFragmentDoc,
    "\n  mutation editProfile($email:String, $password:String) {\n    editProfile(email: $email, password: $password) {\n      ok\n      error\n    }\n  }\n": types.EditProfileDocument,
    "\n            fragment EditedUser on User {\n              verified\n              email}\n            ": types.EditedUserFragmentDoc,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query me {\n    me {\n      id\n      email\n      role\n      verified\n    }\n  }\n  "): (typeof documents)["\n  query me {\n    me {\n      id\n      email\n      role\n      verified\n    }\n  }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createAccount($email: String!, $password: String!, $role: UserRole!) {\n    createAccount(email: $email, password: $password, role: $role) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation createAccount($email: String!, $password: String!, $role: UserRole!) {\n    createAccount(email: $email, password: $password, role: $role) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation logIn($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      ok\n      error\n      token\n    }\n  }\n"): (typeof documents)["\n  mutation logIn($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      ok\n      error\n      token\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation verifyEmail ($code:String!) {\n    verifyEmail(code:$code) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation verifyEmail ($code:String!) {\n    verifyEmail(code:$code) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n        fragment VerifiedUser on User {verified}"): (typeof documents)["\n        fragment VerifiedUser on User {verified}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation editProfile($email:String, $password:String) {\n    editProfile(email: $email, password: $password) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation editProfile($email:String, $password:String) {\n    editProfile(email: $email, password: $password) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n            fragment EditedUser on User {\n              verified\n              email}\n            "): (typeof documents)["\n            fragment EditedUser on User {\n              verified\n              email}\n            "];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;