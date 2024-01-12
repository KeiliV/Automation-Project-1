const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');

describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click("bottomRight");
      cy.get('[data-testid="select-option:Story"]')
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="select:type"]').should("contain", "Story");

      cy.get('[data-testid="select:status"]').click("bottomRight");
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should("have.text", "Done");

      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should("contain", "Baby Yoda");
      cy.get('[data-testid="select:assignees"]').should(
        "contain",
        "Lord Gaben"
      );

      cy.get('[data-testid="select:reporter"]').click("bottomRight");
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should(
        "have.text",
        "Pickle Rick"
      );

      cy.get('[data-testid="select:priority"]').click("bottomRight");
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should("have.text", "Medium");
    });
  });

  it("Should update title, description successfully", () => {
    const title = "TEST_TITLE";
    const description = "TEST_DESCRIPTION";

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get(".ql-snow").click().should("not.exist");

      cy.get(".ql-editor").clear().type(description);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('textarea[placeholder="Short summary"]').should(
        "have.text",
        title
      );
      cy.get(".ql-snow").should("have.text", description);
    });
  });

  //BONUS ASSIGNMENT

  it.only("Should loop through priority elements, save text values to an array, and assert array length", () => {
    //BONUS TASK 1
    const expectedLength = 5;
    let prioritiesArray = [];
    const getSelectPriorityDropdownControl = () =>
      cy.get('[data-testid="select:priority"]');

    getIssueDetailsModal().within(() => {
      getSelectPriorityDropdownControl().should("have.length", 1);

      getSelectPriorityDropdownControl()
        .invoke("text")
        .then((text) => {
          prioritiesArray.push(text);
        });

      cy.then(() => expect(prioritiesArray).to.eql(["High"]));

      getSelectPriorityDropdownControl().click();
      cy.get('[data-testid^="select-option:"]').each(($element) => {
        const text = $element.text();
        prioritiesArray.push(text);
        cy.log(text);
        cy.log("length", prioritiesArray.length);
      });

      cy.then(() => {
        expect(prioritiesArray).to.have.lengthOf(expectedLength);
      });
    });
  });

  it.only("Should get reporter name and assert it contains only characters", () => {
    //BONUS TASK 2
    getIssueDetailsModal().within(() => {
      let regex = /^[a-zA-Z\s]+$/;

      cy.get('[data-testid="select:reporter"]')
        .invoke("text")
        .then((reporterName) => {
          expect(reporterName).to.match(regex);
        });
    });
  });
});
