describe("Time Tracking Functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url().should("eq", `${Cypress.env("baseUrl")}project/board`);
  });
  it("Should add, edit and remove time estimation successfully", () => {
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

  it.only("Should log time and remove logged time succesfully", () => {
    //CREATE ISSUE AND ASS ESTIMATION AS PRECONDITION
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
    cy.get('input[placeholder="Number"]').eq(0).type(10).blur(); //.wait(1000);
    cy.get('[data-testid="icon:stopwatch"]').next().contains("10h estimated");
    cy.get('[data-testid="icon:close"]').first().click();
    cy.contains("Time estimation test ticket").click();
    cy.get('input[placeholder="Number"]').eq(0).should("have.value", "10");

    //LOG TIME TO ISSUE
    //User clicks on time tracking section
    cy.get('[data-testid="icon:stopwatch"]').click();
    //Check that time tracking pop-up dialogue is opened
    cy.get('[data-testid="modal:tracking"]')
      .should("be.visible")
      .within(() => {
        cy.get('input[placeholder="Number"]').eq(0).type(2).blur();
      });
    //User enters value 2 to the field “Time spent”
    //Spent time number is visible in the time tracking section
    //“No Time Logged” label is no longer visible
    cy.get('[data-testid="icon:stopwatch"]')
      .next()
      .contains("2h logged")
      .contains("No time logged")
      .should("not.exist");
    //User enters value 5 to the field “Time remaining”
    cy.get('[data-testid="modal:tracking"]').within(() => {
      cy.get('input[placeholder="Number"]').eq(1).type(5).blur();
    });
    //User sees added time remaining value instead of original estimation in the time tracking section
    cy.get('[data-testid="icon:stopwatch"]')
      .next()
      .contains("5h remaining")
      .contains("10h estimated")
      .should("not.exist");
    //User click button “Done”
    cy.get('[data-testid="modal:tracking"]').contains("Done").click();

    //REMOVE LOGGED TIME

    //User clicks on time tracking section
    cy.get('[data-testid="icon:stopwatch"]').click();
    //Check that time tracking pop-up dialogue is opened
    //User removes value from the field “Time spent”
    cy.get('[data-testid="modal:tracking"]')
      .should("be.visible")
      .within(() => {
        cy.get('input[placeholder="Number"]').eq(0).clear().blur();
      });
    //Spent time number is removed from the time tracking section
    cy.get('[data-testid="icon:stopwatch"]')
      .next()
      .contains("No time logged")
      .contains("2h logged")
      .should("not.exist");

    //User removes value from the field “Time remaining”
    cy.get('[data-testid="modal:tracking"]').within(() => {
      cy.get('input[placeholder="Number"]').eq(1).clear().blur();
    });
    //User sees original estimation in the time tracking section and added time remaining value is removed
    cy.get('[data-testid="icon:stopwatch"]')
      .next()
      .contains("10h estimated")
      .contains("5h remaining")
      .should("not.exist");
    //User click button “Done”
    cy.get('[data-testid="modal:tracking"]').contains("Done").click();
  });
});
