import React from "react";
import { render, RenderResult, waitFor } from "../../../test-utils";
import { Category, CATEGORY_QUERY } from "../../client/category";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("<Category />", () => {
  let renderResult: RenderResult;

  it("render with pagination", async () => {
    const { getByText, getByRole, getAllByRole } = render(
      <MockedProvider
        mocks={[
          {
            request: { query: CATEGORY_QUERY, variables: { slug: "fast-food", page: 1 } },
            result: {
              data: {
                category: {
                  __typename: "CategoryOutput",
                  ok: true,
                  error: null,
                  totalPages: 3,
                  totalResults: 15,
                  restaurants: [
                    {
                      __typename: "Restaurant",
                      id: 1,
                      name: "test restaurant",
                      coverImg: "XXX",
                      category: { __typename: "Category", name: "fast food", slug: "fast-food" },
                      address: "seoul",
                      isPromoted: false,
                    },
                  ],
                  category: {
                    __typename: "Category",
                    id: 1,
                    name: "fast food",
                    slug: "fast-food",
                    coverImg: "XXXX",
                    restaurantCount: 15,
                  },
                },
              },
            },
          },
          {
            request: { query: CATEGORY_QUERY, variables: { slug: "fast-food", page: 2 } },
            result: {
              data: {
                category: {
                  __typename: "CategoryOutput",
                  ok: true,
                  error: null,
                  totalPages: 3,
                  totalResults: 15,
                  restaurants: [
                    {
                      __typename: "Restaurant",
                      id: 1,
                      name: "test restaurant",
                      coverImg: "XXX",
                      category: { __typename: "Category", name: "fast food", slug: "fast-food" },
                      address: "seoul",
                      isPromoted: false,
                    },
                  ],
                  category: {
                    __typename: "Category",
                    id: 1,
                    name: "fast food",
                    slug: "fast-food",
                    coverImg: "XXXX",
                    restaurantCount: 15,
                  },
                },
              },
            },
          },
          {
            request: { query: CATEGORY_QUERY, variables: { slug: "fast-food", page: 3 } },
            result: {
              data: {
                category: {
                  __typename: "CategoryOutput",
                  ok: true,
                  error: null,
                  totalPages: 3,
                  totalResults: 15,
                  restaurants: [
                    {
                      __typename: "Restaurant",
                      id: 1,
                      name: "test restaurant",
                      coverImg: "XXX",
                      category: { __typename: "Category", name: "fast food", slug: "fast-food" },
                      address: "seoul",
                      isPromoted: false,
                    },
                  ],
                  category: {
                    __typename: "Category",
                    id: 1,
                    name: "fast food",
                    slug: "fast-food",
                    coverImg: "XXXX",
                    restaurantCount: 15,
                  },
                },
              },
            },
          },
        ]}
      >
        <MemoryRouter initialEntries={["category/fast-food"]}>
          <Route path="category/:slug">
            <Category />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );
    await waitFor(async () => {
      let pageDisplay = getByText(/page/i);
      expect(document.title).toBe("Category | Nuber Eats");
      expect(pageDisplay).toHaveTextContent(/page 1 of 3/i);
      let rarrBtn = getByRole("button");
      await userEvent.click(rarrBtn);
      pageDisplay = getByText(/page/i);
      expect(pageDisplay).toHaveTextContent(/page 2 of 3/i);
      rarrBtn = getAllByRole("button")[1];
      await userEvent.click(rarrBtn);
      pageDisplay = getByText(/page/i);
      expect(pageDisplay).toHaveTextContent(/page 3 of 3/i);
      const larrBtn = getAllByRole("button")[0];
      await userEvent.click(larrBtn);
      pageDisplay = getByText(/page/i);
      expect(pageDisplay).toHaveTextContent(/page 2 of 3/i);
    });
  });
});
