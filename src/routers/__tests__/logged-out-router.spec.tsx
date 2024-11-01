import { cleanup, render } from "@testing-library/react";
import { ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { LoggedOutRouter } from "../logged-out-router";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  BrowserRouter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock("../../pages/login", () => {
  return {
    Login: () => <span>Login</span>,
  };
});

jest.mock("../../pages/user/confirm-email", () => {
  return {
    ConfirmEmail: () => <span>Confirm Email</span>,
  };
});

describe("<LoggedOutRouter />", () => {
  it("should redirect to login", async () => {
    const { getByText } = render(
      <HelmetProvider>
        <MemoryRouter>
          <LoggedOutRouter />
        </MemoryRouter>
      </HelmetProvider>
    );
    getByText("Login");
  });

  it("should redirect to confirm", async () => {
    const { getByText } = render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/confirm"]}>
          <LoggedOutRouter />
        </MemoryRouter>
      </HelmetProvider>
    );
    getByText("Confirm Email");
  });

  it("should redirect to not found", async () => {
    const { getByText } = render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/notExists"]}>
          <LoggedOutRouter />
        </MemoryRouter>
      </HelmetProvider>
    );
    getByText("Page Not Found");
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
