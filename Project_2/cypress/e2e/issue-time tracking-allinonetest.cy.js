describe("Time tracking functionality", () => {
  before(() => {
    cy.visit("/");
    cy.url().should("eq", `${Cypress.env("baseUrl")}project/board`);
  });

  it("Should create and open a new issue successfully", () => {
    //CREATING NEW ISSUE WITH NO TIME LOGGED AS PRECONDITION FOR TESTING
    cy.get('[data-testid="icon:plus"]').click();
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

    cy.contains("Time estimation test ticket").click().wait(1000);
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
  });

  it("Should add, edit and remove estimated time successfully", () => {
    cy.get('[data-testid="icon:stopwatch"]').next().contains("No time logged");

    //User adds value 10 to “Original estimate (hours)” field
    cy.get('input[placeholder="Number"]').eq(0).type(10).blur(); //.wait(1000);

    //VALIDATION-1
    //Entered value in hours is visible in the time tracking section
    cy.get('[data-testid="icon:stopwatch"]').next().contains("10h estimated");

    //User closes issue detail page
    cy.get('[data-testid="icon:close"]').first().click();
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");

    //User reopens the same issue to check that original estimation is saved
    cy.contains("Time estimation test ticket").click().wait(1000);
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");

    //VALIDATION-2
    //After reopening issue detail view estimation value is still visible
    cy.get('input[placeholder="Number"]').eq(0).should("have.value", "10");

    //EDIT ESTIMATED TIME
    cy.get('input[placeholder="Number"]').eq(0).clear().type(20).blur();

    //VALIDATION-1
    //Updated value in hours is visible in the time tracking section
    cy.get('[data-testid="icon:stopwatch"]').next().contains("20h estimated");
    //User closes issue detail page
    cy.get('[data-testid="icon:close"]').first().click();
    //User reopens the same issue to check that original estimation is saved
    cy.contains("Time estimation test ticket").click();

    //VALIDATIONS
    //After reopening issue detail view updated estimation value is still visible
    cy.get('input[placeholder="Number"]').eq(0).should("have.value", "20");

    //REMOVE ESTIMATED TIME
    //User removes value from the field “Original estimate (hours)”
    cy.get('input[placeholder="Number"]').eq(0).clear().blur().wait(1000);
    //User closes issue detail page
    cy.get('[data-testid="icon:close"]').first().click();
    //User reopens the same issue to check that original estimation is saved
    cy.contains("Time estimation test ticket").click();
    //VALIDATIONS
    //Value is removed from the time tracking section
    cy.get('[data-testid="icon:stopwatch"]')
      .next()
      .contains("20h estimated")
      .should("not.exist");
    //Placeholder “Number” is visible in the original estimate field
    cy.get('input[placeholder="Number"]').eq(0).should("be.visible");
  });
});
