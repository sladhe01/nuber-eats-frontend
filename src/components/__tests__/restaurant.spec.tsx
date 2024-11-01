import { render } from "@testing-library/react";
import React from "react";
import { Restaurant } from "../restaurant";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Restaurant />", () => {
  it("renders OK with props", () => {
    const restaurantProps = {
      id: "1",
      name: "nameTest",
      categoryName: "catTest",
      coverImg: "imgTest",
    };
    const { getByText, container } = render(
      <Router>
        <Restaurant {...restaurantProps} />
      </Router>
    );
    getByText(restaurantProps.name);
    getByText(restaurantProps.categoryName);
    expect(container.firstChild).toHaveAttribute("href", `/restaurants/${restaurantProps.id}`);
    expect(container.querySelector("div[style]")).toHaveStyle(`background-image: url(${restaurantProps.coverImg})`);
  });
});
