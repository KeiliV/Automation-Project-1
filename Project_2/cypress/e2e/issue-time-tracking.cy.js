//CREATE NEW ISSUE
it.skip("Should create an issue successfully", () => {
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
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should add, edit and remove time estimation successfully", () => {
    //Remove estimated time for testing purposes
    cy.get('input[placeholder="Number"]').eq(0).clear();
    //Remove time already logged for testing purposes
    cy.get('[data-testid="icon:stopwatch"]').next().click();
    cy.get('[data-testid="modal:tracking"]').should("be.visible");
    cy.get('input[placeholder="Number"]').eq(1).click().clear();
    cy.contains("button", "Done").click();

    //Check that time tracker has no spent time added (“No Time Logged” label is visible)
    cy.get('[data-testid="icon:stopwatch"]').next().contains("No time logged");

    //User adds value 10 to “Original estimate (hours)” field
    cy.get('input[placeholder="Number"]').eq(0).type(10).blur(); //.wait(1000);

    //VALIDATION-1
    //Entered value in hours is visible in the time tracking section
    cy.get('[data-testid="icon:stopwatch"]').next().contains("10h estimated");

    //User closes issue detail page
    cy.get('[data-testid="icon:close"]').first().click();
    //User reopens the same issue to check that original estimation is saved
    cy.contains("This is an issue of type: Task.").click();

    //VALIDATION-2
    //After reopening issue detail view estimation value is still visible
    cy.get('input[placeholder="Number"]').eq(0).should("have.value", "10");
  });
});
