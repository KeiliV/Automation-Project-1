const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');

const getIssueCreateModal = () => cy.get('[data-testid="modal:issue-create"]');

function createNewIssue(issueTitle) {
  getIssueCreateModal().within(() => {
    cy.get('input[name="title"]').wait(1000).type(issueTitle);
    cy.get('button[type="submit"]').click();
  });
}

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

  it("Should loop through elements, save text values to an array, and assert array length", () => {
    //Predefine variable for expected number of elements in the priority dropdown, for example, “const expectedLength
    const expectedLength = 5;
    //Predefine an empty array variable. Decide which definition is needed: const or let.
    let prioritiesArray = [];

    const getSelectPriorityDropdownControl = () =>
      cy.get('[data-testid="select:priority"]');
    // CYPRESS ALIASES
    //cy.wrap(prioritiesArray).as("prioritiesArray");

    getIssueDetailsModal().within(() => {
      // grab the current selected option and push it to the predefined array

      getSelectPriorityDropdownControl().should("have.length", 1);

      getSelectPriorityDropdownControl()
        .invoke("text")
        .then((text) => {
          prioritiesArray.push(text);
        });
      //IF I want to validate that the intial value was pushed into the array:
      cy.then(() => expect(prioritiesArray).to.eql(["High"]));

      // ALTERNATIVELY USE CYPRESS ALIAS INSTEAD OF .THEN, also must define alias-> see .wrap above
      //cy.get("@prioritiesArray").should("eql", ["High"]);

      //Loop through the elements: each time, invoke the text value from the current element and save it into your predefined array.
      //Print out the added value and length of the array during each iteration using the cy.log(...…) command.
      //cy.get('[data-testid="select:priority"]').click();
      getSelectPriorityDropdownControl().click();
      cy.get('[data-testid^="select-option:"]').each(($element) => {
        const text = $element.text();
        prioritiesArray.push(text);
        cy.log(text);
        cy.log("length", prioritiesArray.length);
        //LONGER WAY TO DO IT, but this has a callback inside of a callback. ALSO I was refetching &element when I alreday had fetched it

        // cy.get($element)
        //   .invoke("text")
        //   .then((text) => {
        //     prioritiesArray.push(text);
        //     cy.log(text);
        //     cy.log("length", prioritiesArray);
        //   });
      });

      //Assert that the array created has the same length as your predefined number if everything is done correctly.
      //Expected result: You have a test that validates values in issue priorities. The finished array must have five elements: [“Lowest“, “Low“, “Medium”, “High“, “Highest”]
      cy.then(() => {
        expect(prioritiesArray).to.include.members([
          //Look up Chai assertions when using expect
          "High",
          "Highest",
          "Medium",
          "Low",
          "Lowest",
        ]);

        expect(prioritiesArray).to.have.lengthOf(expectedLength);
      });
      cy.then(() => expect(reporterName).to.eql(["High"]));
    });
  });

  it("Should get reporter name and assert it contains only characters", () => {
    getIssueDetailsModal().within(() => {
      let regex = /^[a-zA-Z\s]+$/;
      cy.get('[data-testid="select:reporter"]')
        .invoke("text")
        .then((reporterName) => {
          expect(reporterName.match(regex)).to.not.have.lengthOf(0);
        });
    });
  });
});

it.only("Bonus assignment Task 3", () => {
  cy.visit("/");
  cy.url()
    .should("eq", `${Cypress.env("baseUrl")}project/board`)
    .then((url) => {
      cy.visit(url + "/board?modal-issue-create=true");
    });

  const issueTitleWithSpaces = "  This is a test issue for spaces";

  createNewIssue(issueTitleWithSpaces);

  cy.get('[data-testid="modal:issue-create"]').should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");
  cy.reload();
  cy.get('[data-testid="board-list:backlog"]').within(() => {
    cy.get('[data-testid="list-issue"]')
      .first()
      .find("p")
      //.should("have.text", issueTitleWithSpaces.trim());
      .contains(issueTitleWithSpaces.trim());
  });

  //     3. Create a new test that verifies that the application is removing unnecessary spaces on the board view.
  // Create a new test in the spec file “issue-create.cy.js”. DONE
  // Define the issue title as a variable and add multiple spaces between words. For example: const title = ' Hello world! DONE
  // Create an issue with this title (a short summary), save the issue, and observe it on the board (issues on the board will not have extra spaces and will be trimmed).

  // Access the created issue title (by default, new issues will be created at the top of the backlog, so they will always be the first element in the list of all issues on the board).
  // Assert this title with a predefined variable, but remove extra spaces from it (string function trim()).
  // Expected result: You will have a test that validates that the issue title on the board does not have leading and trailing spaces in it
});

//FOR LEARNING
// begin example of how anonymous funtions (also called lambdas) can be used instead of named functions
// this
//   cy.wrap(prioritiesArray).then( (ary) => expect(ary).to.eql(["High"]) );
// is exactly the same as this
//   function assertTheExpectation (ary) {
//     return expect(ary).to.eql(["High"])
//   }
//   cy.wrap(prioritiesArray).then( assertTheExpectation );
// end
