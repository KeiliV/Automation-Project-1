class TimeTracking {
  constructor() {
    this.submitButton = 'button[type="submit"]';
    this.issueModal = '[data-testid="modal:issue-create"]';
    this.title = 'input[name="title"]';
    this.closeDetailModalButton = '[data-testid="icon:close"]';
    this.createNewIssueButton = '[data-testid="icon:plus"]';
    this.originalEstimateHoursField = 'input[placeholder="Number"]';
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
    cy.get(this.originalEstimateHoursField)
      .eq(0)
      .clear()
      .type(inputHours)
      .blur();
  }

  ensureEstimatedHoursAreVisible(estimatedHours) {
    cy.get('[data-testid="icon:stopwatch"]').next().contains(estimatedHours);
  }

  valueIsVisibleInEstimateHoursField(valueInField) {
    cy.get(this.originalEstimateHoursField)
      .eq(0)
      .should("have.value", valueInField);
  }

  closeDetailModal() {
    cy.get(this.closeDetailModalButton).first().click();
  }
}

export default new TimeTracking();
