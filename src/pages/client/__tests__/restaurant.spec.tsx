import React from "react";
import { render, waitFor } from "../../../test-utils";
import { RESTAURANT_QUERY, RestaurantDetail } from "../../client/restaurant";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, Route } from "react-router-dom";

describe("<RestaurantDetail />", () => {
  it("render OK", async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: { query: RESTAURANT_QUERY, variables: { restaurantId: 1 } },
            result: {
              data: {
                restaurant: {
                  __typename: "RestaurantOutput",
                  ok: true,
                  error: null,
                  restaurant: {
                    __typename: "Restaurant",
                    id: 1,
                    name: "",
                    coverImg: "",
                    category: { __typename: "Category", name: "", slug: "" },
                    address: "",
                    isPromoted: false,
                  },
                },
              },
            },
          },
        ]}
      >
        <MemoryRouter initialEntries={["/restaurants/1"]}>
          <Route path="/restaurants/:id">
            <RestaurantDetail />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );
    await waitFor(async () => {
      expect(document.title).toBe("Restaurant | Nuber Eats");
    });
  });
});
