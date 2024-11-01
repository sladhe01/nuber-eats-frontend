import { render } from "@testing-library/react";
import React from "react";
import { CategoryIcon } from "../category-icon";

describe("<Category Icon />", () => {
  it("renders OK with props", () => {
    const categoryProps = {
      name: "nameTest",
      coverImg: "imgTest",
    };
    const { getByText, container } = render(<CategoryIcon {...categoryProps} />);
    getByText(categoryProps.name);
    expect(container.querySelector("div[style]")).toHaveStyle(`background-image: url(${categoryProps.coverImg})`);
  });
});
