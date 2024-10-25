/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type CategoryInputType = {
  coverImg: Scalars['String']['input'];
  name: Scalars['String']['input'];
  restaurants?: InputMaybe<Array<RestaurantInputType>>;
  slug: Scalars['String']['input'];
};

export type ChoiceInputType = {
  extra?: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type CommonPaymentInputType = {
  naverPayPayment: NapyInputType;
  paddlePayment: PaddleInputType;
  user?: InputMaybe<UserInputType>;
};

export type CreateOrderItem = {
  dishId: Scalars['Int']['input'];
  options?: InputMaybe<Array<CreateOrderItemOption>>;
};

export type CreateOrderItemOption = {
  choices: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type DishInputType = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  options?: InputMaybe<Array<DishOptionInputType>>;
  photo?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Int']['input'];
  restaurant: RestaurantInputType;
};

export type DishOptionInputType = {
  allowMultipleChoices: Scalars['Boolean']['input'];
  choices: Array<ChoiceInputType>;
  name: Scalars['String']['input'];
  required: Scalars['Boolean']['input'];
};

export type NapyInputType = {
  paymentId: Scalars['String']['input'];
};

export type OrderInputType = {
  customer?: InputMaybe<UserInputType>;
  destination?: InputMaybe<Scalars['String']['input']>;
  driver?: InputMaybe<UserInputType>;
  items: Array<OrderItemInputType>;
  restaurant: RestaurantInputType;
  status: OrderStatus;
  total?: InputMaybe<Scalars['Float']['input']>;
};

export type OrderItemInputType = {
  dish: DishInputType;
  options?: InputMaybe<Array<OrderItemOptionInputType>>;
};

export type OrderItemOptionInputType = {
  choices: Array<ChoiceInputType>;
  name: Scalars['String']['input'];
};

export enum OrderStatus {
  Canceled = 'Canceled',
  Cooked = 'Cooked',
  Cooking = 'Cooking',
  Delivered = 'Delivered',
  Pending = 'Pending',
  PickedUp = 'PickedUp'
}

export type PaddleInputType = {
  restaurant?: InputMaybe<RestaurantInputType>;
  restaurantId?: InputMaybe<Scalars['Int']['input']>;
  transactionId: Scalars['String']['input'];
};

export type RestaurantInputType = {
  address: Scalars['String']['input'];
  category: CategoryInputType;
  coverImg: Scalars['String']['input'];
  isPromoted: Scalars['Boolean']['input'];
  menu?: InputMaybe<Array<DishInputType>>;
  name: Scalars['String']['input'];
  orders: Array<OrderInputType>;
  owner: UserInputType;
  promotedUntil?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserInputType = {
  email: Scalars['String']['input'];
  orders: Array<OrderInputType>;
  password: Scalars['String']['input'];
  payments: Array<CommonPaymentInputType>;
  restaurants?: InputMaybe<Array<RestaurantInputType>>;
  rides: Array<OrderInputType>;
  role: UserRole;
  verified?: Scalars['Boolean']['input'];
};

export enum UserRole {
  Client = 'Client',
  Delivery = 'Delivery',
  Owner = 'Owner'
}

export type CreateAccountMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: UserRole;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'CreateAccountOutput', ok: boolean, error?: string | null } };

export type LogInMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LogInMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginOutput', ok: boolean, error?: string | null, token?: string | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, email: string, role: UserRole, verified: boolean } };


export const CreateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserRole"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<CreateAccountMutation, CreateAccountMutationVariables>;
export const LogInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<LogInMutation, LogInMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;