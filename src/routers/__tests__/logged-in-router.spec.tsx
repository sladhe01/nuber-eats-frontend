import React, { ReactNode } from "react";
import { LoggedInRouter } from "../logged-in-router";
import { useMe } from "../../hooks/useMe";
import { cleanup, render, waitFor } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

jest.mock("../../pages/client/restaurants", () => {
  return {
    Restaurants: () => <span>Restaurants</span>,
  };
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  BrowserRouter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock("../../hooks/useMe", () => {
  return { useMe: jest.fn() };
});

describe("<LoggedInRouter />", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should render loading", async () => {
    (useMe as jest.Mock).mockImplementation(() => ({
      data: null,
      loading: true,
      error: "error",
    }));

    const { getByText } = render(
      <HelmetProvider>
        <MemoryRouter>
          <LoggedInRouter />
        </MemoryRouter>
      </HelmetProvider>
    );
    getByText("Loading...");
  });

  it("should render OK", async () => {
    (useMe as jest.Mock).mockImplementation(() => ({
      data: {
        me: {
          role: "Client",
        },
      },
      loading: false,
      error: null,
    }));

    const { getByText } = render(
      <HelmetProvider>
        <MemoryRouter>
          <LoggedInRouter />
        </MemoryRouter>
      </HelmetProvider>
    );
    getByText("Restaurants");
  });

  it("should reirect to Not Found page", async () => {
    (useMe as jest.Mock).mockImplementation(() => ({
      data: {
        me: {
          role: "Client",
        },
      },
      loading: false,
      error: null,
    }));

    await waitFor(async () => {
      const { getByText } = render(
        <HelmetProvider>
          <MemoryRouter initialEntries={["/notExist"]}>
            <LoggedInRouter />
          </MemoryRouter>
        </HelmetProvider>
      );
      getByText("Page Not Found");
    });
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
