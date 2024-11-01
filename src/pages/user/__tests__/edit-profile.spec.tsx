import { cleanup, RenderResult, waitFor } from "@testing-library/react";
import React from "react";
import { render } from "../../../test-utils";
import { EDIT_PROFILE_MUTATION, EditProfile, LOGIN_MUTATION } from "../edit-profile";
import { MockedProvider } from "@apollo/client/testing";
import { ME_QUERY } from "../../../hooks/useMe";
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

jest.mock("../../../hooks/useMe", () => {
  return {
    useMe: () => {
      return { data: { me: { id: 1, email: "presentEmail" } } };
    },
  };
});

describe("<EditProfile />", () => {
  it("render ok", async () => {
    render(
      <MockedProvider>
        <EditProfile />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(document.title).toBe("Edit Profile | Nuber Eats");
    });
  });

  it("renders new email vailidation error", async () => {
    await waitFor(async () => {
      const { getByPlaceholderText, getByRole, getAllByRole, debug } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: EDIT_PROFILE_MUTATION,
                variables: { email: "duplicated@mail.com" },
              },
              result: { data: { editProfile: { ok: false, error: "Email is aleady exists" } } },
            },
            {
              request: { query: EDIT_PROFILE_MUTATION, variables: { email: "wont@work", password: undefined } },
              result: { data: { editProfile: { ok: false, error: "error" } } },
            },
            {
              request: { query: LOGIN_MUTATION, variables: { email: "presentEmail", password: "presentPassword" } },
              result: { data: { login: { ok: true, error: null, token: "" } } },
            },
            {
              request: { query: LOGIN_MUTATION, variables: { email: "presentEmail", password: "wrongPassword" } },
              result: { data: { login: { ok: false, error: "Wrong password", token: "" } } },
            },
          ]}
        >
          <EditProfile />
        </MockedProvider>
      );
      const presentPassword = getByPlaceholderText(/present password/i);
      const newEmail = getByPlaceholderText(/new email/i);
      const submitBtn = getByRole("button");
      await userEvent.type(presentPassword, "{Enter}");
      let errorMessage = getByRole("alert");
      expect(errorMessage).toHaveTextContent(/please enter a present password/i);
      await userEvent.type(presentPassword, "presentPassword");
      await userEvent.type(newEmail, "wont@work");
      await userEvent.tab();
      errorMessage = getByRole("alert");
      expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
      await userEvent.clear(newEmail);
      await userEvent.type(newEmail, "duplicated@mail.com");
      await userEvent.click(submitBtn);
      await new Promise((resolve) => {
        setTimeout(resolve, 5);
      });
      errorMessage = getByRole("alert");
      expect(errorMessage).toHaveTextContent(/email is aleady exists/i);
      await userEvent.clear(presentPassword);
      await userEvent.type(presentPassword, "wrongPassword");
      await userEvent.click(submitBtn);
      await new Promise((resolve) => {
        setTimeout(resolve, 5);
      });
      errorMessage = getByRole("alert");
      expect(errorMessage).toHaveTextContent(/wrong password/i);
    });
  });

  it("redirect to home", async () => {
    await waitFor(async () => {
      const { getByPlaceholderText, getByRole, getAllByRole, debug } = render(
        <MockedProvider
          mocks={[
            {
              request: { query: EDIT_PROFILE_MUTATION, variables: { email: "will@work.com", password: undefined } },
              result: { data: { editProfile: { ok: true, error: null } } },
            },
            {
              request: { query: LOGIN_MUTATION, variables: { email: "presentEmail", password: "presentPassword" } },
              result: { data: { login: { ok: true, error: null, token: "" } } },
            },
          ]}
        >
          <EditProfile />
        </MockedProvider>
      );
      const presentPassword = getByPlaceholderText(/present password/i);
      const newEmail = getByPlaceholderText(/new email/i);
      const submitBtn = getByRole("button");
      await userEvent.type(presentPassword, "presentPassword");
      await userEvent.type(newEmail, "will@work.com");
      await userEvent.click(submitBtn);
      await new Promise((resolve) => {
        setTimeout(resolve, 5);
      });
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  afterEach(() => {
    cleanup();
  });
});
