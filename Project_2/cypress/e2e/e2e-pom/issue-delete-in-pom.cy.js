import IssueModal from "../../pages/IssueModal";

describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        //open issue detail modal with title from line 13
        cy.contains(issueTitle).click();
      });
  });

  //issue title, that we are testing with, saved into variable
  const issueTitle = "This is an issue of type: Task.";

  it("Should delete issue successfully", () => {
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();

    cy.reload();
    cy.get(IssueModal.backlogList).should("not.contain", issueTitle);
  });

  it("Should cancel deletion process successfully", () => {
    //add steps to start deletion proces but cancel it

    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();

    //Assert that the issue is still on Jira board
    cy.reload();
    cy.get(IssueModal.backlogList).should("contain", issueTitle);
  });
});
