import { useParams } from "react-router-dom";
import { gql, useFragment } from "../../__generated__";
import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { RestaurantPartsFragment } from "../../__generated__/graphql";
import { Restaurant } from "../../components/restaurant";
import { useState } from "react";

export const CATEGORY_QUERY = gql(`
  query category ($slug: String!, $page: Int) {
    category (slug:$slug, page:$page) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
`);

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  const params = useParams<ICategoryParams>();
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery(CATEGORY_QUERY, { variables: { slug: params.slug, page: page } });
  const restaurants = useFragment(RESTAURANT_FRAGMENT, data?.category.restaurants);
  const onNextPageClick = () => {
    setPage((current) => current + 1);
  };
  const onPrevPageClick = () => {
    setPage((current) => current - 1);
  };

  return (
    <div className="h-screen">
      <Helmet>
        <title>Category | Nuber Eats</title>
      </Helmet>
      {!loading && (
        <div className="container pb-20 mt-8">
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {restaurants?.map((restaurant: RestaurantPartsFragment) => {
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
              Page {page} of {data?.category.totalPages}
            </span>
            {page !== data?.category.totalPages ? (
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
