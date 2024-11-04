describe("Log In", () => {
  it("should see login page", () => {
    cy.visit("/").title().should("eq", "Login | Nuber Eats");
  });

  it("can see email / password validation errors", () => {
    cy.visit("/");
    cy.findByPlaceholderText(/email/i).type("bad@email");
    cy.findByPlaceholderText(/password/i).focus();
    cy.findByRole("alert").should("have.text", "Please enter a valid email");
    cy.findByPlaceholderText(/email/i).clear();
    cy.findAllByRole("alert").eq(0).should("have.text", "Email is required");
    cy.findAllByRole("alert").eq(1).should("have.text", "Password is required");
  });

  it("can fill out the form and login", () => {
    cy.login("test@email.com", "12345");
  });
});
