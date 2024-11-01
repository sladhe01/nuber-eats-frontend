import React from "react";
import { Search, SEARCH_RESTAURANT } from "../../client/search";
import { BrowserRouter, MemoryRouter, Route } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
// import {  render, RenderResult, waitFor } from "../../test-utils";
import { cleanup, render, RenderResult, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet-async";
import userEvent from "@testing-library/user-event";

describe("<Search />", () => {
  let renderResult: RenderResult;

  it("should redirect to home with no query params", async () => {
    await waitFor(async () => {
      renderResult = render(
        <HelmetProvider>
          <MockedProvider>
            <MemoryRouter initialEntries={["/search?term="]}>
              <Route path="/search">
                <Search />
              </Route>
              <Route path="/" exact>
                <Helmet>
                  <title>Home | Nuber Eats</title>
                </Helmet>
              </Route>
            </MemoryRouter>
          </MockedProvider>
        </HelmetProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(document.title).toBe("Home | Nuber Eats");
    });
  });

  it("should render with pagination", async () => {
    await waitFor(async () => {
      renderResult = render(
        <HelmetProvider>
          <MockedProvider
            mocks={[
              {
                request: { query: SEARCH_RESTAURANT, variables: { query: "xxx", page: 1 } },
                result: {
                  data: {
                    searchRestaurant: {
                      __typename: "SearchRestaurantOutput",
                      ok: true,
                      error: null,
                      totalPages: 2,
                      totalResults: 7,
                      restaurants: [
                        {
                          __typename: "Restaurant",
                          id: 1,
                          name: "",
                          coverImg: "",
                          address: "",
                          isPromoted: false,
                          category: {
                            __typename: "Category",
                            id: 1,
                            name: "",
                            coverImg: "",
                            slug: "",
                            restaurantCount: 1,
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                request: { query: SEARCH_RESTAURANT, variables: { query: "xxx", page: 2 } },
                result: {
                  data: {
                    searchRestaurant: {
                      __typename: "SearchRestaurantOutput",
                      ok: true,
                      error: null,
                      totalPages: 2,
                      totalResults: 7,
                      restaurants: [
                        {
                          __typename: "Restaurant",
                          id: 1,
                          name: "",
                          coverImg: "",
                          address: "",
                          isPromoted: false,
                          category: {
                            __typename: "Category",
                            id: 1,
                            name: "",
                            coverImg: "",
                            slug: "",
                            restaurantCount: 1,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ]}
          >
            <MemoryRouter initialEntries={["/search?term=xxx"]}>
              <Route path="/search">
                <Search />
              </Route>
              <Route path="/" exact>
                <Helmet>
                  <title>Home | Nuber Eats</title>
                </Helmet>
              </Route>
            </MemoryRouter>
          </MockedProvider>
        </HelmetProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    await waitFor(async () => {
      expect(document.title).toBe("Search | Nuber Eats");
      const { getByRole, getByText } = renderResult;
      const rarrBtn = getByRole("button");
      await userEvent.click(rarrBtn);
      let pageDisplay = getByText(/page/i);
      expect(pageDisplay).toHaveTextContent(/page 2 of 2/i);
      const larr = getByRole("button");
      await userEvent.click(larr);
      pageDisplay = getByText(/page/i);
      expect(pageDisplay).toHaveTextContent(/page 1 of 2/i);
    });
  });

  it("renders not found result", async () => {
    await waitFor(async () => {
      renderResult = render(
        <HelmetProvider>
          <MockedProvider
            mocks={[
              {
                request: { query: SEARCH_RESTAURANT, variables: { query: "xxx", page: 1 } },
                result: {
                  data: {
                    searchRestaurant: {
                      __typename: "SearchRestaurantOutput",
                      ok: false,
                      error: "Not found restaurant",
                      totalPages: null,
                      totalResults: null,
                      restaurants: [],
                    },
                  },
                },
              },
            ]}
          >
            <MemoryRouter initialEntries={["/search?term=xxx"]}>
              <Route path="/search">
                <Search />
              </Route>
              <Route path="/" exact>
                <Helmet>
                  <title>Home | Nuber Eats</title>
                </Helmet>
              </Route>
            </MemoryRouter>
          </MockedProvider>
        </HelmetProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      const { getByText } = renderResult;
      getByText("We didt't find a match for xxx");
    });
  });
});
