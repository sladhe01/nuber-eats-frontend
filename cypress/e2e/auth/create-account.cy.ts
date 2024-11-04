describe("Create account", () => {
  it("should see email/password validation erros", () => {
    cy.visit("/");
    cy.findByText(/create an account/i).click();
    cy.findByPlaceholderText(/email/i).type("bad@email");
    cy.findByPlaceholderText(/password/i).focus();
    cy.findAllByRole("alert").eq(0).should("have.text", "Please enter a valid email");
    cy.findByPlaceholderText(/email/i).clear();
    cy.findAllByRole("alert").eq(0).should("have.text", "Email is required");
    cy.findAllByRole("alert").eq(1).should("have.text", "Password is required");
    cy.findByPlaceholderText(/email/i).clear().type("test@gmail.com");
    cy.findByPlaceholderText(/password/i).type("12345");
    cy.findByRole("button").click();
    cy.findByRole("alert").should("have.text", "User with that email is aleady existing");
  });

  it("shoud be able to create account and login", () => {
    cy.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === "createAccount") {
        req.reply((res) => {
          res.send({ fixture: "auth/create-account.json" });
        });
      }
    });
    cy.visit("/create-account");
    cy.findByPlaceholderText(/email/i).type("test@email.com");
    cy.findByPlaceholderText(/password/i).type("12345");
    cy.findByRole("button").click();
    cy.wait(1000);
    cy.login("test@email.com", "12345");
  });
});
