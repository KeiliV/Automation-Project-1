//CREATE NEW ISSUE
it("Should create an issue successfully", () => {
  cy.visit("/");
  cy.url()
    .should("eq", `${Cypress.env("baseUrl")}project/board`)
    .then((url) => {
      cy.visit(url + "/board?modal-issue-create=true");
    });
  cy.get('[data-testid="modal:issue-create"]').within(() => {
    cy.get('input[name="title"]')
      .wait(1000)
      .type("Time estimation test ticket");
    cy.get('input[name="title"]').should(
      "have.value",
      "Time estimation test ticket"
    );
    cy.get('button[type="submit"]').click();
  });

  cy.get('[data-testid="modal:issue-create"]').should("not.exist");
  cy.reload();

  cy.get('[data-testid="board-list:backlog"]').contains(
    "Time estimation test ticket"
  );
});

describe("Time Tracking Functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("Time estimation test ticket").click();
      });
  });

  it("Should add, edit and remove time estimation successfully", () => {
    //Check that time tracker has no spent time added (“No Time Logged” label is visible)
    cy.get('[data-testid="icon:stopwatch"]').next().contains("No time logged");

    //User adds value 10 to “Original estimate (hours)” field

    //User closes issue detail page

    //User reopens the same issue to check that original estimation is saved

    //VALIDATIONS
    //Entered value in hours is visible in the time tracking section
    //After reopening issue detail view estimation value is still visible
  });
});
