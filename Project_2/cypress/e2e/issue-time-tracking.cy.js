describe("Time Tracking Functionality", () => {
  it("Should add, edit and remove time estimation successfully", () => {
    cy.visit("/");
    cy.url().should("eq", `${Cypress.env("baseUrl")}project/board`);

    //CREATE NEW TEST WITH NO TIME LOGGED FOR TESTING PURPOSE
    cy.log("CREATING A NEW ISSUE WITH NO TIME LOGGED FOR TESTING PURPOSES");

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
    cy.wait(1000);

    cy.contains("Time estimation test ticket").click();

    cy.log("ADD, EDIT & DELETE ESTIMATED TIME");
    //ADD ESTIMATED TIME

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
    cy.contains("Time estimation test ticket").click();

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
