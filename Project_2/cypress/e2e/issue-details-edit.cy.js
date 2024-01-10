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

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it.only("Should loop through elements, save text values to an array, and assert array length", () => {
    //Predefine variable for expected number of elements in the priority dropdown, for example, “const expectedLength
    const expectedLength = 4;
    //Predefine an empty array variable. Decide which definition is needed: const or let.
    let prioritiesArray = [];
    // CYPRESS ALIASES
    // cy.wrap(prioritiesArray).as("prioritiesArray");

    getIssueDetailsModal().within(() => {
      // grab the current selected option
      const selectPriorityDropdownControl = cy.get(
        '[data-testid="select:priority"]'
      );

      selectPriorityDropdownControl.should("have.length", 1);

      selectPriorityDropdownControl.invoke("text").then((text) => {
        prioritiesArray.push(text);
      });

      cy.then(() => expect(prioritiesArray).to.eql(["High"]));

      // USE CYPRESS ALIAS INSTEAD OF THEN
      // cy.get("@prioritiesArray").should("eql", ["High"]);

      // begin example of how anonymous funtions (also called lambdas) can be used instead of named functions
      // this
      //   cy.wrap(prioritiesArray).then( (ary) => expect(ary).to.eql(["High"]) );
      // is exactly the same as this
      //   function assertTheExpectation (ary) {
      //     return expect(ary).to.eql(["High"])
      //   }
      //   cy.wrap(prioritiesArray).then( assertTheExpectation );
      // end
    });
  });
});

//Loop through the elements: each time, invoke the text value from the current element and save it into your predefined array.
//Print out the added value and length of the array during each iteration using the cy.log(...…) command.
//Assert that the array created has the same length as your predefined number if everything is done correctly.

//Expected result: You have a test that validates values in issue priorities. The finished array must have five elements: [“Lowest“, “Low“, “Medium”, “High“, “Highest”]
