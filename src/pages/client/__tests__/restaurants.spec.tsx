import React from "react";
import { render, RenderResult, waitFor } from "../../../test-utils";
import { MockedProvider } from "@apollo/client/testing";
import { Restaurants, RESTAURANTS_QUERY } from "../../client/restaurants";
import userEvent from "@testing-library/user-event";

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useHistory: () => {
      return { push: mockPush };
    },
  };
});

describe("<Restaurants />", () => {
  let renderResult: RenderResult;
  beforeEach(async () => {
    renderResult = render(
      <MockedProvider
        mocks={[
          {
            request: { query: RESTAURANTS_QUERY, variables: { page: 1 } },
            result: {
              data: {
                allCategories: {
                  ok: true,
                  error: false,
                  categories: [{ __typename: "Category", id: 1, name: "", coverImg: "", slug: "", restaurantCount: 1 }],
                },
                restaurants: {
                  ok: true,
                  error: false,
                  totalPages: 2,
                  totalResults: 7,
                  results: [
                    {
                      __typename: "Restaurant",
                      id: 1,
                      name: "testRestaurant",
                      coverImg: "xxx",
                      address: "seoul",
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
            request: { query: RESTAURANTS_QUERY, variables: { page: 2 } },
            result: {
              data: {
                allCategories: {
                  ok: true,
                  error: false,
                  categories: [{ __typename: "Category", id: 1, name: "", coverImg: "", slug: "", restaurantCount: 1 }],
                },
                restaurants: {
                  ok: true,
                  error: false,
                  totalPages: 2,
                  totalResults: 7,
                  results: [
                    {
                      __typename: "Restaurant",
                      id: 1,
                      name: "testRestaurant",
                      coverImg: "xxx",
                      address: "seoul",
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
        <Restaurants />
      </MockedProvider>
    );
  });

  it("should render with pagination", async () => {
    const { debug, getByText, getByRole } = renderResult;

    await waitFor(async () => {
      expect(document.title).toBe("Home | Nuber Eats");
      let pageDisplay = getByText(/page/i);
      expect(pageDisplay).toHaveTextContent(/page 1 of 2/i);
      const rarrBtn = getByRole("button");
      await userEvent.click(rarrBtn);
      pageDisplay = getByText(/page/i);
      expect(pageDisplay).toHaveTextContent(/page 2 of 2/i);
      const larrBtn = getByRole("button");
      await userEvent.click(larrBtn);
      pageDisplay = getByText(/page/i);
      expect(pageDisplay).toHaveTextContent(/page 1 of 2/i);
    });
  });

  it("render with searchbox", async () => {
    const { getByRole } = renderResult;
    const searchBox = getByRole("searchbox");
    await waitFor(async () => {
      await userEvent.type(searchBox, "xxx");
      await userEvent.type(searchBox, "{enter}");
    });
    expect(mockPush).toHaveBeenCalledWith({ pathname: "/search", search: "?term=xxx" });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
