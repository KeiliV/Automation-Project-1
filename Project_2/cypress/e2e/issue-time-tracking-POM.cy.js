class TimeTracking {
  constructor() {
    this.submitButton = 'button[type="submit"]';
    this.issueModal = '[data-testid="modal:issue-create"]';
    this.title = 'input[name="title"]';
    this.closeDetailModalButton = '[data-testid="icon:close"]';
    this.createNewIssueButton = '[data-testid="icon:plus"]';
    this.timeInputField = 'input[placeholder="Number"]';
    this.stopwatchIcon = '[data-testid="icon:stopwatch"]';
    this.timeTrackingPopUp = '[data-testid="modal:tracking"]';
  }

  getIssueModal() {
    return cy.get(this.issueModal);
  }

  createNewIssue(issueDetails) {
    this.getIssueModal().within(() => {
      cy.get(this.title).wait(1000).type(issueDetails.title);
      cy.get(this.submitButton).click();
    });
  }
  validateNewIssueIsVisibleOnBoard(issueDetails) {
    cy.get(this.issueModal).should("not.exist");
    cy.contains(issueDetails.title).should("be.visible");
  }

  openIssue(issueDetails) {
    cy.contains(issueDetails.title).click();
  }

  enterValueInEstimateHoursField(inputHours) {
    cy.get(this.timeInputField).eq(0).clear().type(inputHours).blur();
  }

  ensureTimeTrackingEstimatedHoursLabelContains(estimatedHours) {
    return cy
      .get('[data-testid="icon:stopwatch"]')
      .next()
      .contains(estimatedHours);
  }

  valueIsVisibleInEstimateHoursField(valueInField) {
    cy.get(this.timeInputField).eq(0).should("have.value", valueInField);
  }

  closeIssueModal() {
    cy.get(this.closeDetailModalButton).first().click();
  }

  openTimeTrackingPopUp() {
    cy.get(timeTracking.stopwatchIcon).click();
  }

  validateTimeTrackingPopUpIsVisible() {
    return cy.get(timeTracking.timeTrackingPopUp).should("be.visible");
  }

  closetimeTrackingPopUp() {
    cy.get(this.timeTrackingPopUp).contains("Done").click();
  }

  validateTimeLabelsAreReplaced(addedTime, removedTime) {
    cy.get(this.stopwatchIcon)
      .next()
      .contains(addedTime)
      .contains(removedTime)
      .should("not.exist");
  }
}

const timeTracking = new TimeTracking();
//here I am instantiating the class TimeTracking and binding that instance to the variable timeTracking

const issueTitleName = "Time tracking test ticket";

const issueDetails = {
  title: issueTitleName,
};

describe("Time Tracking Functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should add, edit and remove time estimation successfully", () => {
    //CREATE AND VALIDATE NEW ISSUE WITH NO TIME LOGGED
    timeTracking.createNewIssue(issueDetails);
    timeTracking.validateNewIssueIsVisibleOnBoard(issueDetails);
    timeTracking.openIssue(issueDetails);
    timeTracking.ensureTimeTrackingEstimatedHoursLabelContains(
      "No time logged"
    );
    //ADD ESTIMATED TIME
    timeTracking.enterValueInEstimateHoursField(10);
    timeTracking.ensureTimeTrackingEstimatedHoursLabelContains("10h estimated");

    timeTracking.closeIssueModal();
    timeTracking.openIssue(issueDetails);
    timeTracking.valueIsVisibleInEstimateHoursField(10);
    //EDIT ESTIMATED TIME
    timeTracking.enterValueInEstimateHoursField(20);
    timeTracking.ensureTimeTrackingEstimatedHoursLabelContains("20h estimated");
    timeTracking.closeIssueModal();
    timeTracking.openIssue(issueDetails);
    timeTracking.valueIsVisibleInEstimateHoursField(20);

    //REMOVE ESTIMATED TIME
    cy.get(timeTracking.timeInputField).eq(0).clear().blur().wait(1000);
    timeTracking.closeIssueModal();
    timeTracking.openIssue(issueDetails);
    timeTracking
      .ensureTimeTrackingEstimatedHoursLabelContains("20h estimated")
      .should("not.exist");
    cy.get(timeTracking.timeInputField).eq(0).should("be.visible");
  });

  it("Should log time and remove logged time succesfully", () => {
    //CREATE A NEW ISSUE AND ADD ESTIMATED TIME AS A PRECONDITION
    timeTracking.createNewIssue(issueDetails);
    timeTracking.validateNewIssueIsVisibleOnBoard(issueDetails);
    timeTracking.openIssue(issueDetails);
    timeTracking.enterValueInEstimateHoursField(10);
    timeTracking.ensureTimeTrackingEstimatedHoursLabelContains("10h estimated");

    //LOG TIME TO ISSUE
    timeTracking.openTimeTrackingPopUp();

    timeTracking.validateTimeTrackingPopUpIsVisible().within(() => {
      cy.get(timeTracking.timeInputField).eq(0).type(2).blur();
    });

    timeTracking.validateTimeLabelsAreReplaced("2h logged", "No time logged");

    cy.get(timeTracking.timeTrackingPopUp).within(() => {
      cy.get(timeTracking.timeInputField).eq(1).type(5).blur();
    });

    timeTracking.validateTimeLabelsAreReplaced("5h remaining", "10h estimated");
    timeTracking.closetimeTrackingPopUp();

    //REMOVE LOGGED TIME
    timeTracking.openTimeTrackingPopUp();
    timeTracking.validateTimeTrackingPopUpIsVisible().within(() => {
      cy.get(timeTracking.timeInputField).eq(0).clear().blur();
    });

    timeTracking.validateTimeLabelsAreReplaced("No time logged", "2h logged");

    cy.get(timeTracking.timeTrackingPopUp).within(() => {
      cy.get(timeTracking.timeInputField).eq(1).clear().blur();
    });

    timeTracking.validateTimeLabelsAreReplaced("10h estimated", "5h remaining");
    timeTracking.closetimeTrackingPopUp();
  });
});
