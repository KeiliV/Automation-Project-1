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
    cy.get(this.createNewIssueButton).click();
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

  ensureEstimatedHoursAreVisible(estimatedHours) {
    cy.get('[data-testid="icon:stopwatch"]').next().contains(estimatedHours);
  }

  valueIsVisibleInEstimateHoursField(valueInField) {
    cy.get(this.timeInputField).eq(0).should("have.value", valueInField);
  }

  closeIssueModal() {
    cy.get(this.closeDetailModalButton).first().click();
  }

  closeTimeTrackingPopUp() {
    cy.get(this.timeTrackingPopUp).contains("Done").click();
  }

  validateTimeLabels(addedTime, removedTime) {
    cy.get(this.stopwatchIcon)
      .next()
      .contains(addedTime)
      .contains(removedTime)
      .should("not.exist");
  }
}

export default new TimeTracking();
