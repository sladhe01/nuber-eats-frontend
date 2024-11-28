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
    "\n  fragment RestaurantParts on Restaurant {\n    id\n    name\n    coverImg\n    category {\n      name\n      slug\n    }\n    address\n    isPromoted\n  }\n": types.RestaurantPartsFragmentDoc,
    "\n  fragment CategoryParts on Category {\n    id\n    name\n    coverImg\n    slug\n    restaurantCount\n  }\n": types.CategoryPartsFragmentDoc,
    "\n  fragment DishParts on Dish {\n    id\n    name\n    price\n    photo\n    description\n    options {\n      name\n      allowMultipleChoices\n      required\n      choices {\n        name\n        extra\n      }\n    }\n  }  \n": types.DishPartsFragmentDoc,
    "\n  fragment OrderParts on Order {\n    id\n    createdAt\n    total\n  }\n": types.OrderPartsFragmentDoc,
    "\n  query me {\n    me {\n      id\n      email\n      role\n      verified\n    }\n  }\n  ": types.MeDocument,
    "\n  query category ($slug: String!, $page: Int) {\n    category (slug:$slug, page:$page) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n      category {\n        ...CategoryParts\n      }\n    }\n  }\n": types.CategoryDocument,
    "\n  query restaurant ($restaurantId: Int!) {\n    restaurant (restaurantId: $restaurantId) {\n      ok\n      error\n      restaurant {\n        ...RestaurantParts\n      }\n    }\n  }\n": types.RestaurantDocument,
    "\n  query restaurantsPage($page:Int) {\n    allCategories {\n      ok\n      error\n      categories {\n        ...CategoryParts\n      }\n    }\n    restaurants (page:$page) {\n      ok\n      error\n      totalPages\n      totalResults\n      results {\n        ...RestaurantParts\n      }\n    }\n  }\n": types.RestaurantsPageDocument,
    "\n  query searchRestaurant ($query: String!, $page: Int) {\n    searchRestaurant (query:$query, page:$page) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n    }\n  }\n": types.SearchRestaurantDocument,
    "\n  mutation createAccount($email: String!, $password: String!, $role: UserRole!) {\n    createAccount(email: $email, password: $password, role: $role) {\n      ok\n      error\n    }\n  }\n": types.CreateAccountDocument,
    "\n  mutation logIn($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      ok\n      error\n      token\n    }\n  }\n": types.LogInDocument,
    "\n  mutation createDish ( $name: String!, $price: Int!, $photo: String!, $description: String!, $options: [DishOptionInputType!], $restaurantId: Int!) {\n    createDish (name: $name, price:$price, photo: $photo, description: $description, options: $options, restaurantId: $restaurantId) {\n      ok\n      error\n    }\n  }\n": types.CreateDishDocument,
    "\n  mutation createRestaurant ( $name: String!, $coverImg: String!, $address: String!, $categoryName: String!) {\n    createRestaurant (name: $name, coverImg: $coverImg, address: $address, categoryName: $categoryName) {\n      ok\n      error\n      restaurantId\n    }\n  }\n": types.CreateRestaurantDocument,
    "\n  query allCategories {\n    allCategories {\n      ok\n      error\n      categories {\n        id\n        name\n        slug\n      }\n    }\n  }\n": types.AllCategoriesDocument,
    "\n  mutation editDish ( $name: String, $price: Int, $photo: String, $description: String, $options: [DishOptionInputType!], $dishId: Int!) {\n    editDish (name: $name, price:$price, photo: $photo, description: $description, options: $options, dishId: $dishId) {\n      ok\n      error\n    }\n  }\n": types.EditDishDocument,
    "\n  query getDish ( $id: Float!) {\n    getDish ( id: $id ) {\n      ok\n      error\n      dish {\n        id\n        name\n        price\n        description\n        photo\n        options {\n          name\n          allowMultipleChoices\n          required\n          choices {\n            name\n            extra\n          }\n        }\n      }\n    }\n  }\n": types.GetDishDocument,
    "\n  mutation editRestaurant ($name: String, $coverImg: String, $address: String, $categoryName: String, $restaurantId: Float!) {\n    editRestaurant (name:$name, coverImg:$coverImg, address: $address, categoryName: $categoryName, restaurantId: $restaurantId) {\n      ok\n      error\n    }\n  } \n": types.EditRestaurantDocument,
    "\n  query myRestaurant ($id: Float!) {\n    myRestaurant (id: $id) {\n      ok\n      error\n      restaurant {\n        name\n        ...RestaurantParts\n        menu {\n          ...DishParts\n        }\n        orders {\n          ...OrderParts\n        }\n      }\n    }\n  }": types.MyRestaurantDocument,
    "\n mutation createRestaurantPayment ($transactionId: String!, $restaurantId: Int) {\n  createRestaurantPayment (transactionId: $transactionId, restaurantId: $restaurantId) {\n    ok\n    error\n  }\n }  \n": types.CreateRestaurantPaymentDocument,
    "\n  query myRestaurants {\n    myRestaurants {\n      ok\n      error\n      restaurants {\n        name\n        id\n        isPromoted\n        coverImg\n        address\n        category {\n          name\n          slug\n        }\n      }\n    }\n  }  \n": types.MyRestaurantsDocument,
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
export function gql(source: "\n  fragment RestaurantParts on Restaurant {\n    id\n    name\n    coverImg\n    category {\n      name\n      slug\n    }\n    address\n    isPromoted\n  }\n"): (typeof documents)["\n  fragment RestaurantParts on Restaurant {\n    id\n    name\n    coverImg\n    category {\n      name\n      slug\n    }\n    address\n    isPromoted\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment CategoryParts on Category {\n    id\n    name\n    coverImg\n    slug\n    restaurantCount\n  }\n"): (typeof documents)["\n  fragment CategoryParts on Category {\n    id\n    name\n    coverImg\n    slug\n    restaurantCount\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment DishParts on Dish {\n    id\n    name\n    price\n    photo\n    description\n    options {\n      name\n      allowMultipleChoices\n      required\n      choices {\n        name\n        extra\n      }\n    }\n  }  \n"): (typeof documents)["\n  fragment DishParts on Dish {\n    id\n    name\n    price\n    photo\n    description\n    options {\n      name\n      allowMultipleChoices\n      required\n      choices {\n        name\n        extra\n      }\n    }\n  }  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment OrderParts on Order {\n    id\n    createdAt\n    total\n  }\n"): (typeof documents)["\n  fragment OrderParts on Order {\n    id\n    createdAt\n    total\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query me {\n    me {\n      id\n      email\n      role\n      verified\n    }\n  }\n  "): (typeof documents)["\n  query me {\n    me {\n      id\n      email\n      role\n      verified\n    }\n  }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query category ($slug: String!, $page: Int) {\n    category (slug:$slug, page:$page) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n      category {\n        ...CategoryParts\n      }\n    }\n  }\n"): (typeof documents)["\n  query category ($slug: String!, $page: Int) {\n    category (slug:$slug, page:$page) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n      category {\n        ...CategoryParts\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query restaurant ($restaurantId: Int!) {\n    restaurant (restaurantId: $restaurantId) {\n      ok\n      error\n      restaurant {\n        ...RestaurantParts\n      }\n    }\n  }\n"): (typeof documents)["\n  query restaurant ($restaurantId: Int!) {\n    restaurant (restaurantId: $restaurantId) {\n      ok\n      error\n      restaurant {\n        ...RestaurantParts\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query restaurantsPage($page:Int) {\n    allCategories {\n      ok\n      error\n      categories {\n        ...CategoryParts\n      }\n    }\n    restaurants (page:$page) {\n      ok\n      error\n      totalPages\n      totalResults\n      results {\n        ...RestaurantParts\n      }\n    }\n  }\n"): (typeof documents)["\n  query restaurantsPage($page:Int) {\n    allCategories {\n      ok\n      error\n      categories {\n        ...CategoryParts\n      }\n    }\n    restaurants (page:$page) {\n      ok\n      error\n      totalPages\n      totalResults\n      results {\n        ...RestaurantParts\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query searchRestaurant ($query: String!, $page: Int) {\n    searchRestaurant (query:$query, page:$page) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n    }\n  }\n"): (typeof documents)["\n  query searchRestaurant ($query: String!, $page: Int) {\n    searchRestaurant (query:$query, page:$page) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n    }\n  }\n"];
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
export function gql(source: "\n  mutation createDish ( $name: String!, $price: Int!, $photo: String!, $description: String!, $options: [DishOptionInputType!], $restaurantId: Int!) {\n    createDish (name: $name, price:$price, photo: $photo, description: $description, options: $options, restaurantId: $restaurantId) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation createDish ( $name: String!, $price: Int!, $photo: String!, $description: String!, $options: [DishOptionInputType!], $restaurantId: Int!) {\n    createDish (name: $name, price:$price, photo: $photo, description: $description, options: $options, restaurantId: $restaurantId) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createRestaurant ( $name: String!, $coverImg: String!, $address: String!, $categoryName: String!) {\n    createRestaurant (name: $name, coverImg: $coverImg, address: $address, categoryName: $categoryName) {\n      ok\n      error\n      restaurantId\n    }\n  }\n"): (typeof documents)["\n  mutation createRestaurant ( $name: String!, $coverImg: String!, $address: String!, $categoryName: String!) {\n    createRestaurant (name: $name, coverImg: $coverImg, address: $address, categoryName: $categoryName) {\n      ok\n      error\n      restaurantId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query allCategories {\n    allCategories {\n      ok\n      error\n      categories {\n        id\n        name\n        slug\n      }\n    }\n  }\n"): (typeof documents)["\n  query allCategories {\n    allCategories {\n      ok\n      error\n      categories {\n        id\n        name\n        slug\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation editDish ( $name: String, $price: Int, $photo: String, $description: String, $options: [DishOptionInputType!], $dishId: Int!) {\n    editDish (name: $name, price:$price, photo: $photo, description: $description, options: $options, dishId: $dishId) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation editDish ( $name: String, $price: Int, $photo: String, $description: String, $options: [DishOptionInputType!], $dishId: Int!) {\n    editDish (name: $name, price:$price, photo: $photo, description: $description, options: $options, dishId: $dishId) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getDish ( $id: Float!) {\n    getDish ( id: $id ) {\n      ok\n      error\n      dish {\n        id\n        name\n        price\n        description\n        photo\n        options {\n          name\n          allowMultipleChoices\n          required\n          choices {\n            name\n            extra\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getDish ( $id: Float!) {\n    getDish ( id: $id ) {\n      ok\n      error\n      dish {\n        id\n        name\n        price\n        description\n        photo\n        options {\n          name\n          allowMultipleChoices\n          required\n          choices {\n            name\n            extra\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation editRestaurant ($name: String, $coverImg: String, $address: String, $categoryName: String, $restaurantId: Float!) {\n    editRestaurant (name:$name, coverImg:$coverImg, address: $address, categoryName: $categoryName, restaurantId: $restaurantId) {\n      ok\n      error\n    }\n  } \n"): (typeof documents)["\n  mutation editRestaurant ($name: String, $coverImg: String, $address: String, $categoryName: String, $restaurantId: Float!) {\n    editRestaurant (name:$name, coverImg:$coverImg, address: $address, categoryName: $categoryName, restaurantId: $restaurantId) {\n      ok\n      error\n    }\n  } \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query myRestaurant ($id: Float!) {\n    myRestaurant (id: $id) {\n      ok\n      error\n      restaurant {\n        name\n        ...RestaurantParts\n        menu {\n          ...DishParts\n        }\n        orders {\n          ...OrderParts\n        }\n      }\n    }\n  }"): (typeof documents)["\n  query myRestaurant ($id: Float!) {\n    myRestaurant (id: $id) {\n      ok\n      error\n      restaurant {\n        name\n        ...RestaurantParts\n        menu {\n          ...DishParts\n        }\n        orders {\n          ...OrderParts\n        }\n      }\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n mutation createRestaurantPayment ($transactionId: String!, $restaurantId: Int) {\n  createRestaurantPayment (transactionId: $transactionId, restaurantId: $restaurantId) {\n    ok\n    error\n  }\n }  \n"): (typeof documents)["\n mutation createRestaurantPayment ($transactionId: String!, $restaurantId: Int) {\n  createRestaurantPayment (transactionId: $transactionId, restaurantId: $restaurantId) {\n    ok\n    error\n  }\n }  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query myRestaurants {\n    myRestaurants {\n      ok\n      error\n      restaurants {\n        name\n        id\n        isPromoted\n        coverImg\n        address\n        category {\n          name\n          slug\n        }\n      }\n    }\n  }  \n"): (typeof documents)["\n  query myRestaurants {\n    myRestaurants {\n      ok\n      error\n      restaurants {\n        name\n        id\n        isPromoted\n        coverImg\n        address\n        category {\n          name\n          slug\n        }\n      }\n    }\n  }  \n"];
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