import TimeTracking from "../pages/TimeTracking";

const issueTitleName = "Time tracking test ticket";

const issueDetails = {
  title: issueTitleName,
};

describe("Time Tracking Functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
      });
  });

  it("Should add, edit and remove time estimation successfully", () => {
    //CREATE AND VALIDATE NEW ISSUE WITH NO TIME LOGGED
    TimeTracking.createNewIssue(issueDetails);
    TimeTracking.validateNewIssueIsVisibleOnBoard(issueDetails);
    TimeTracking.openIssue(issueDetails);
    cy.get(TimeTracking.stopwatchIcon).next().contains("No time logged");
    //ADD ESTIMATED TIME
    TimeTracking.enterValueInEstimateHoursField(10);
    TimeTracking.ensureEstimatedHoursAreVisible("10h estimated");

    TimeTracking.closeIssueModal();
    TimeTracking.openIssue(issueDetails);
    TimeTracking.valueIsVisibleInEstimateHoursField(10);
    //EDIT ESTIMATED TIME
    TimeTracking.enterValueInEstimateHoursField(20);
    TimeTracking.ensureEstimatedHoursAreVisible("20h estimated");
    TimeTracking.closeIssueModal();
    TimeTracking.openIssue(issueDetails);
    TimeTracking.valueIsVisibleInEstimateHoursField(20);

    //REMOVE ESTIMATED TIME
    cy.get(TimeTracking.timeInputField).eq(0).clear().blur().wait(1000);
    TimeTracking.closeIssueModal();
    TimeTracking.openIssue(issueDetails);
    //VALIDATIONS
    //Value is removed from the time tracking section
    cy.get(TimeTracking.stopwatchIcon)
      .next()
      .contains("20h estimated")
      .should("not.exist");
    //Placeholder “Number” is visible in the original estimate field
    cy.get(TimeTracking.timeInputField).eq(0).should("be.visible");
  });

  it.only("Should log time and remove logged time succesfully", () => {
    //CREATE ISSUE AND ADD ESTIMATITED TIME AS PRECONDITION
    TimeTracking.createNewIssue(issueDetails);
    TimeTracking.validateNewIssueIsVisibleOnBoard(issueDetails);
    TimeTracking.openIssue(issueDetails);
    cy.get(TimeTracking.stopwatchIcon).next().contains("No time logged");
    TimeTracking.enterValueInEstimateHoursField(10);
    TimeTracking.ensureEstimatedHoursAreVisible("10h estimated");
    TimeTracking.closeIssueModal();
    TimeTracking.openIssue(issueDetails);
    TimeTracking.valueIsVisibleInEstimateHoursField(10);

    //LOG TIME TO ISSUE

    cy.get(TimeTracking.stopwatchIcon).click();

    cy.get(TimeTracking.timeTrackingPopUp)
      .should("be.visible")
      .within(() => {
        cy.get(TimeTracking.timeInputField).eq(0).type(2).blur();
      });

    TimeTracking.validateTimeLabels("2h logged", "No time logged");

    cy.get(TimeTracking.timeTrackingPopUp).within(() => {
      cy.get(TimeTracking.timeInputField).eq(1).type(5).blur();
    });

    TimeTracking.validateTimeLabels("5h remaining", "10h estimated");

    TimeTracking.closeTimeTrackingPopUp();

    //REMOVE LOGGED TIME

    cy.get(TimeTracking.stopwatchIcon).click();

    cy.get(TimeTracking.timeTrackingPopUp)
      .should("be.visible")
      .within(() => {
        cy.get(TimeTracking.timeInputField).eq(0).clear().blur();
      });

    TimeTracking.validateTimeLabels("No time logged", "2h logged");

    cy.get(TimeTracking.timeTrackingPopUp).within(() => {
      cy.get(TimeTracking.timeInputField).eq(1).clear().blur();
    });

    TimeTracking.validateTimeLabels("10h estimated", "5h remaining");
    TimeTracking.closeTimeTrackingPopUp();
  });
});
