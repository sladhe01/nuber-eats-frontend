import { render, RenderResult, waitFor } from "../../test-utils";
import React from "react";
import { Login, LOGIN_MUTATION } from "../login";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { ApolloProvider } from "@apollo/client";
import userEvent from "@testing-library/user-event";

describe("<Login />", () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  beforeEach(() => {
    mockedClient = createMockClient();
    renderResult = render(
      <ApolloProvider client={mockedClient}>
        <Login />
      </ApolloProvider>
    );
  });

  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Nuber Eats");
    });
  });

  it("displays email validation errors", async () => {
    const { getByPlaceholderText, getByRole, getAllByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    let errorMessage;
    await waitFor(async () => {
      await userEvent.type(email, "this@wont");
      await userEvent.tab();
      errorMessage = getByRole("alert");
    });
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
    await waitFor(async () => {
      await userEvent.clear(email);
      await userEvent.tab();
      errorMessage = getAllByRole("alert")[0];
    });
    expect(errorMessage).toHaveTextContent(/email is required/i);
  });

  it("displays password required errors", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const password = getByPlaceholderText(/password/i);
    let errorMessage;
    await waitFor(async () => {
      await userEvent.click(password);
      await userEvent.tab();
      errorMessage = getByRole("alert");
    });
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });

  it("submits form and calls mutation", async () => {
    const formData = {
      email: "real@test.com",
      password: "realpassword",
    };
    const mockedMutaionResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "XXX",
          error: null,
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutaionResponse);
    jest.spyOn(Storage.prototype, "setItem");
    const { getByPlaceholderText, getByRole } = renderResult;
    await waitFor(async () => {
      const email = getByPlaceholderText(/email/i);
      const password = getByPlaceholderText(/password/i);
      const submiBtn = getByRole("button");
      await userEvent.type(email, formData.email);
      await userEvent.type(password, formData.password);
      await userEvent.click(submiBtn);
    });
    expect(mockedMutaionResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutaionResponse).toHaveBeenCalledWith(formData);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith("nuber-token", "XXX");
  });

  it("shows error on mutation", async () => {
    const formData = {
      email: "real@test.com",
      password: "realpassword",
    };
    const mockedMutaionResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: false,
          token: null,
          error: "mutation-error",
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutaionResponse);
    const { getByPlaceholderText, getByRole } = renderResult;
    await waitFor(async () => {
      const email = getByPlaceholderText(/email/i);
      const password = getByPlaceholderText(/password/i);
      const submiBtn = getByRole("button");
      await userEvent.type(email, formData.email);
      await userEvent.type(password, formData.password);
      await userEvent.click(submiBtn);
    });
    expect(mockedMutaionResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutaionResponse).toHaveBeenCalledWith(formData);
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/mutation-error/i);
  });
});
