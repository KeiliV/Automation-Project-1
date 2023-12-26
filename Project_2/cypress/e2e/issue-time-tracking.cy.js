//CREATE NEW ISSUE
it("Should create an issue successfully", () => {
  cy.visit("/");
  cy.url()
    .should("eq", `${Cypress.env("baseUrl")}project/board`)
    .then((url) => {
      cy.visit(url + "/board?modal-issue-create=true");
    });
  cy.get('[data-testid="modal:issue-create"]').within(() => {
    cy.get('input[name="title"]').type("Time estimation test ticket");
    cy.get('input[name="title"]').should(
      "have.value",
      "Time estimation test ticket"
    );
    cy.get('button[type="submit"]').click();
  });

  cy.get('[data-testid="modal:issue-create"]').should("not.exist");

  cy.get('[data-testid="board-list:backlog"]').contains(
    "Time estimation test ticket"
  );
});
