const comment = "TEST_COMMENT";
const commentEdited = "TEST_COMMENT_EDITED";
const commentSection = '[data-testid="issue-comment"]';
const confirmationPopup = '[data-testid="modal:confirm"]';

function getIssueDetailsModal() {
  return cy.get('[data-testid="modal:issue-details"]');
}

function getFirstComment() {
  return cy.get(commentSection).first();
}

function saveCommentButtonClick() {
  cy.contains("button", "Save").click().should("not.exist");
}

describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should create a comment successfully", () => {
    const comment = "TEST_COMMENT";

    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.contains("Add a comment...").should("exist");
      cy.get('[data-testid="issue-comment"]').should("contain", comment);
    });
  });

  it("Should edit a comment successfully", () => {
    const previousComment = "An old silent pond...";
    const comment = "TEST_COMMENT_EDITED";

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");

      cy.get('textarea[placeholder="Add a comment..."]')
        .should("contain", previousComment)
        .clear()
        .type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('[data-testid="issue-comment"]')
        .should("contain", "Edit")
        .and("contain", comment);
    });
  });

  it("Should delete a comment successfully", () => {
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should("not.exist");
  });

  it.only("Should add, edit and delete a comment successfully", () => {
    getIssueDetailsModal().within(() => {
      //ADD COMMENT
      cy.contains("Add a comment...").click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      saveCommentButtonClick();

      cy.contains("Add a comment...").should("exist");

      cy.get(commentSection).should("contain", comment);

      //EDIT COMMENT
      getFirstComment().contains("Edit").click().should("not.exist");

      cy.get('textarea[placeholder="Add a comment..."]')
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
});
