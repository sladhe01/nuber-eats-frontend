import React from "react";
import { render, waitFor } from "../../../test-utils";
import { ConfirmEmail, VERIFY_EMAIL_MUTATION } from "../confirm-email";
import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";

jest.mock("../../../hooks/useMe", () => {
  return {
    useMe: () => {
      return { data: { me: { id: "" } } };
    },
  };
});

describe("<ConfirmEamil />", () => {
  it("render OK", async () => {
    const client = createMockClient();
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: { verifyEmail: { ok: true, error: null } },
    });
    client.setRequestHandler(VERIFY_EMAIL_MUTATION, mockedMutationResponse);
    await waitFor(async () => {
      const { debug } = render(
        <ApolloProvider client={client}>
          <ConfirmEmail />
        </ApolloProvider>
      );
    });
    await waitFor(() => {
      expect(document.title).toBe("Verify Eamil | Nuber Eats");
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
