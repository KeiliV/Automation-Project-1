const comment = "TEST_COMMENT";
const commentEdited = "TEST_COMMENT_EDITED";
const commentSection = '[data-testid="issue-comment"]';
const confirmationPopup = '[data-testid="modal:confirm"]';
const typeCommentTextarea = 'textarea[placeholder="Add a comment..."]';

function getIssueDetailsModal() {
  return cy.get('[data-testid="modal:issue-details"]');
}

function getFirstComment() {
  return cy.get(commentSection).first();
}

function saveCommentButtonClick() {
  cy.contains("button", "Save").click().should("not.exist");
}

it("Should add, edit and delete a comment successfully", () => {
  cy.visit("/");
  cy.url()
    .should("eq", `${Cypress.env("baseUrl")}project/board`)
    .then((url) => {
      cy.visit(url + "/board");
      cy.contains("This is an issue of type: Task.").click();
    });

  getIssueDetailsModal().within(() => {
    //ADD COMMENT
    cy.contains("Add a comment...").click();

    cy.get(typeCommentTextarea).type(comment);

    saveCommentButtonClick();

    cy.contains("Add a comment...").should("exist");

    cy.get(commentSection).should("contain", comment);

    //EDIT COMMENT
    getFirstComment().contains("Edit").click().should("not.exist");

    cy.get(typeCommentTextarea)
      .should("contain", comment)
      .clear()
      .type(commentEdited);

    saveCommentButtonClick();

    getFirstComment().contains(commentEdited);

    //DELETE COMMENT
    getFirstComment().contains("Delete").click();
  });

  cy.get(confirmationPopup).should("be.visible");
  cy.get(confirmationPopup).within(() => {
    cy.contains("Are you sure you want to delete this comment?").should(
      "be.visible"
    );
    cy.contains("Once you delete, it's gone for good").should("be.visible");
    cy.contains("button", "Delete comment").click().should("not.exist");
  });

  cy.get(commentSection).contains(commentEdited).should("not.exist");
});
