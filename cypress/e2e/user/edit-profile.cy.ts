describe("Edit profile", () => {
  beforeEach(() => {
    cy.login("test@email.com", "12345");
  });
  it("can go to /edit-profile using the header", () => {
    cy.get('a[href="/edit-profile"]').click();
    cy.title().should("eq", "Edit Profile | Nuber Eats");
  });

  it("can change email", () => {
    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body?.operationName === "editProfile" && req.body?.variables?.email) {
        req.body.variables.email = "test@email.com";
        req.reply((res) => {
          res.send({ fixture: "user/edit-profile.json" });
        });
      }
    });
    cy.visit("/edit-profile");
    cy.findAllByPlaceholderText(/present password/i).type("12345");
    cy.findAllByPlaceholderText(/new email/i).type("new@email.com");
    cy.findByRole("button").click();
  });
});
