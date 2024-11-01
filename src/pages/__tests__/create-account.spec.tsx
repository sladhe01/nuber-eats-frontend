import { render, RenderResult, waitFor } from "../../test-utils";
import React from "react";
import { CREATE_ACCOUNT_MUTATION, CreateAccount } from "../create-account";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { ApolloProvider } from "@apollo/client";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../__generated__/graphql";

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

describe("<CreateAccount />", () => {
  let renderResult: RenderResult;
  let mockClient: MockApolloClient;
  beforeEach(async () => {
    mockClient = createMockClient();
    renderResult = render(
      <ApolloProvider client={mockClient}>
        <CreateAccount />
      </ApolloProvider>
    );
  });

  it("render OK", async () => {
    await waitFor(async () => {
      expect(document.title).toBe("Create Account | Nuber Eats");
    });
  });

  it("renders validation error", async () => {
    const { getAllByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    await waitFor(async () => {
      await userEvent.type(email, "wont@work");
      await userEvent.tab();
    });
    let errorMessages = getAllByRole("alert");
    expect(errorMessages[0]).toHaveTextContent(/Please enter a valid email/i);
    await waitFor(async () => {
      await userEvent.clear(email);
      await userEvent.tab();
    });
    errorMessages = getAllByRole("alert");
    expect(errorMessages[0]).toHaveTextContent(/email is required/i);
    expect(errorMessages[1]).toHaveTextContent(/password is required/i);
  });

  it("submits mutation with form values", async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const role = getByRole("combobox");
    const submitBtn = getByRole("button");
    const formData = {
      email: "working@mail.com",
      password: "testpassword",
      role: UserRole.Client,
    };
    const mockedCreateAccountMutationResponse = jest.fn().mockResolvedValue({
      data: { createAccount: { ok: true, error: "mutation-error" } },
    });
    mockClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, mockedCreateAccountMutationResponse);
    jest.spyOn(window, "alert").mockImplementation(() => null);
    await waitFor(async () => {
      await userEvent.type(email, formData.email);
      await userEvent.type(password, formData.password);
      await userEvent.selectOptions(role, formData.role);
      await userEvent.click(submitBtn);
    });
    expect(mockedCreateAccountMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedCreateAccountMutationResponse).toHaveBeenCalledWith(formData);
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("Account created! Log in now!");
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("mutation-error");
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
