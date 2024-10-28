import React, { useState } from "react";
import { gql, useFragment } from "../../__generated__";
import { useQuery } from "@apollo/client";
import { Restaurant } from "../../components/restaurant";
import { CategoryIcon } from "../../components/category-icon";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { CategoryPartsFragment, RestaurantPartsFragment } from "../../__generated__/graphql";

const RESTAURANTS_QUERY = gql(`
  query restaurantsPage($page:Int) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants (page:$page) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
`);

interface IFormProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery(RESTAURANTS_QUERY, { variables: { page } });
  const onNextPageClick = () => {
    setPage((current) => current + 1);
  };
  const onPrevPageClick = () => {
    setPage((current) => current - 1);
  };
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();
  const onSearchSubmit = () => {
    const searchTerm = getValues("searchTerm");
    history.push({ pathname: "/search", search: `?term=${searchTerm}` });
  };
  const categories = useFragment(CATEGORY_FRAGMENT, data?.allCategories.categories);
  const results = useFragment(RESTAURANT_FRAGMENT, data?.restaurants.results);

  return (
    <div className="h-screen">
      <Helmet>
        <title>Home | Nuber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-40 flex items-center justify-center"
      >
        <input
          {...register("searchTerm", { required: true, min: 3 })}
          className="input rounded-md border-0 w-3/4 md:w-5/12"
          type="search"
          placeholder="Search Restaurants..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          <div className="flex justify-around max-w-3xl mx-auto">
            {categories?.map((category: CategoryPartsFragment) => (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <CategoryIcon coverImg={category.coverImg} name={category.name} />
              </Link>
            ))}
          </div>
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {results?.map((restaurant: RestaurantPartsFragment) => {
              return (
                <Restaurant
                  key={restaurant.id}
                  id={restaurant.id + ""}
                  coverImg={restaurant.coverImg}
                  name={restaurant.name}
                  categoryName={restaurant.category.name}
                />
              );
            })}
          </div>
          <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
            {page > 1 ? (
              <button onClick={onPrevPageClick} className="ocus:outline-none font-medium text-2xl">
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span>
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button onClick={onNextPageClick} className="focus:outline-none font-medium text-2xl">
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
