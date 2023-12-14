
describe('Issue deletion', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click();
    });
  });

    it('Should delete an issue successfully', () => {
    //Delete the issue
    cy.get('[data-testid="icon:trash"]').click()
    cy.get('[data-testid="modal:confirm"]').contains('Delete issue').click()

    //Assert that confirmation dialogue is not visible.
    cy.get('[data-testid="modal:confirm"]').should('not.exist')

    //Assert that issue is deleted and not on Jira board
    cy.reload()
    cy.get('[data-testid="board-list:backlog"]').should('not.contain', 'This is an issue of type: Task.')

  });
  
  it('Issue Deletion Cancellation', () => {
    //Cancel deletion
    cy.get('[data-testid="icon:trash"]').click()
    cy.get('[data-testid="modal:confirm"]').contains('Cancel').click()

    //Assert that confirmation dialogue is not visible.
    cy.get('[data-testid="modal:confirm"]').should('not.exist')

    //Close the issue
    cy.get('[data-testid="icon:close"]').first().click()

    //Assert that the issue is still on Jira board
    cy.reload()
    cy.get('[data-testid="board-list:backlog"]').should('contain', 'This is an issue of type: Task.')
  })
});