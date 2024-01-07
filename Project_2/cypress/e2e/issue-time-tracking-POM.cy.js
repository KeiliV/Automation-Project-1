import TimeTracking from "../pages/TimeTracking";

const issueTitleName = "Time estimation test ticket";

const issueDetails = {
  title: issueTitleName,
};

describe("Time Tracking Functionality", () => {
  it("Should add, edit and remove time estimation successfully", () => {
    cy.visit("/");
    cy.url().should("eq", `${Cypress.env("baseUrl")}project/board`);

    //CREATE AND VALIDATE NEW ISSUE WITH NO TIME LOGGED
    TimeTracking.createNewIssue(issueDetails);
    TimeTracking.validateNewIssueIsVisibleOnBoard(issueDetails);
    TimeTracking.openIssue(issueDetails);
    cy.get('[data-testid="icon:stopwatch"]').next().contains("No time logged");
    //UPDATE ESTIMATED TIME
    TimeTracking.enterValueInEstimateHoursField(10);
    TimeTracking.ensureEstimatedHoursAreVisible("10h estimated");

    TimeTracking.closeDetailModal();
    TimeTracking.openIssue(issueDetails);
    TimeTracking.valueIsVisibleInEstimateHoursField(10);
    //EDIT ESTIMATED TIME
    TimeTracking.enterValueInEstimateHoursField(20);
    TimeTracking.ensureEstimatedHoursAreVisible("20h estimated");
    TimeTracking.closeDetailModal();
    TimeTracking.openIssue(issueDetails);
    TimeTracking.valueIsVisibleInEstimateHoursField(20);

    //REMOVE ESTIMATED TIME
    cy.get('input[placeholder="Number"]').eq(0).clear().blur().wait(1000);
    TimeTracking.closeDetailModal();
    TimeTracking.openIssue(issueDetails);
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
