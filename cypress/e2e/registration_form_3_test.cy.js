beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Test suite for visual tests for registration form 3 is already created
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns
    * checkboxes, their content and links
    * email format
 */

describe('Assignment 7 Section 1: Visual Tests', () => {

    it('Check that radio button list is correct', () => {
        // Array of found elements with given selector has 4 elements in total
        cy.get('input[type="radio"]').should('have.length', 4)

        // Verify labels of the radio buttons
        cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','Never')

        //Verify default state of radio buttons
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        // Selecting one will remove selection from other radio button
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })

    it('Check country and city dropdown elements and dependencies', () => {
        //Check the lements in Country dropdown
        cy.get('#country').children().should('have.length', 4)
        cy.get('#country').find('option').eq(0).should('have.text', '')
        cy.get('#country').find('option').eq(1).should('have.text', 'Spain')
        cy.get('#country').find('option').eq(2).should('have.text', 'Estonia')
        cy.get('#country').find('option').eq(3).should('have.text', 'Austria')

        
        //Check city options when Spain is selected
        cy.get('#country').select('Spain')
        cy.get('#city').should('be.enabled').children().should('have.length', 5)
        cy.get('#city').find('option').eq(0).should('have.text', '')
        cy.get('#city').find('option').eq(1).should('have.text', 'Malaga')
        cy.get('#city').find('option').eq(2).should('have.text', 'Madrid')
        cy.get('#city').find('option').eq(3).should('have.text', 'Valencia')
        cy.get('#city').find('option').eq(4).should('have.text', 'Corralejo')

        //Check city options when Estonia is selected
        cy.get('#country').select('Estonia')
        cy.get('#city').should('be.enabled').children().should('have.length', 4)
        cy.get('#city').find('option').eq(0).should('have.text', '')
        cy.get('#city').find('option').eq(1).should('have.text', 'Tallinn')
        cy.get('#city').find('option').eq(2).should('have.text', 'Haapsalu')
        cy.get('#city').find('option').eq(3).should('have.text', 'Tartu')

        //Check city options when Austria is selected
        cy.get('#country').select('Austria')
        cy.get('#city').should('be.enabled').children().should('have.length', 4)
        cy.get('#city').find('option').eq(0).should('have.text', '')
        cy.get('#city').find('option').eq(1).should('have.text', 'Vienna')
        cy.get('#city').find('option').eq(2).should('have.text', 'Salzburg')
        cy.get('#city').find('option').eq(3).should('have.text', 'Innsbruck')
        
    })

    it('Check the checkboxes content and links', () => {
    

        //Verify default state of checkboxes
        cy.get('[type=checkbox]').eq(0).should('not.be.checked') //first checkbox not checked
        cy.get('[type=checkbox]').eq(1).should('not.be.checked') //second checkbox not checked

        //Can check that both checkboxes are not selected in one line of code because they have the same selector
        cy.get('[type=checkbox]').should('not.be.checked')
        
        // Verify label of the first checkbox- Can't figure out how to select this message location
        //cy.get('div').contains('???').should('have.text','Accept our privacy policy')

        //Verify label for cookies checkbox
        cy.get('button').children().eq(0).should('have.text', 'Accept our cookie policy')
        //Verify link for cookies checkbox
        cy.get('button').children().eq(0).should('have.attr', 'href', 'cookiePolicy.html').click()
        // Check that currently opened URL is correct
        cy.url().should('contain', '/cookiePolicy.html')
        
        // Go back to previous page
        cy.go('back')
        //Checking that the URL we went back to is Registration form 2's URL
        cy.url().should('contain', '/registration_form_3.html')


    })


    it('Check email format', () => {

        cy.get('[ng-model="email"]').type('john')
        cy.get('[ng-show="myForm.email.$error.email"]').should('be.visible').should('contain', 'Invalid email address')

        cy.get('[ng-model="email"]').clear().type('john@email.com')
        cy.get('[ng-show="myForm.email.$error.email"]').should('not.be.visible')

    })

})


    /*
    BONUS TASK: add functional tests for registration form 3
    Task list:
    * Create second test suite for functional tests
    * Create tests to verify logic of the page:
        * all fields are filled in + validation
        * only mandatory fields are filled in + validations
        * mandatory fields are absent + validations (try using function)
        * If city is already chosen and country is updated, then city choice should be removed
        * add file (google yourself for solution)
    */

describe('Assignment 7 Section 2: Functional Tests', () => {

    it('Check all fields filled in + validation', () => {
        cy.get('#name').type('John')
        cy.get('[ng-model="email"]').type('john@email.com')
        cy.get('#country').select('Spain')
        cy.get('#city').select('Malaga')
        cy.get('div').contains('Date of birth').next().type('1990-01-10')
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('#birthday').type('1990-01-10')
        //upload file solved in the last test on this page
        cy.get('[type=checkbox]').click({ multiple: true }) //as both checkboxes have the same selector-> can select them in one line
        
        //Checking that submit button is enabled
        cy.get('[ng-disabled="myForm.$invalid"]').should('be.enabled')

    })   

    it('Check mandatory fields added + validation', () => {
        cy.get('#name').type('John')
        cy.get('[ng-model="email"]').type('john@email.com')
        cy.get('#country').select('Spain')
        cy.get('#city').select('Malaga')
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('#birthday').type('1990-01-10')
        cy.get('[type=checkbox]').first().click()  //Clicking only on 'Accept terms and conditions' checkbox

        //Checking that submit button is enabled
        cy.get('[ng-disabled="myForm.$invalid"]').should('be.enabled')

    }) 

    it('Check when email is missing + validation', () => {
        //Using a function on the bottom of this page
        mandatoryFields()
        cy.get('[ng-model="email"]').clear()
        cy.get('form').click()

        //Checking that submit button is disabled
        cy.get('[ng-disabled="myForm.$invalid"]').should('be.disabled')

        //Checking email missing error message
        cy.get('[ng-show="myForm.email.$error.required"]').should('be.visible').should('contain', 'Email is required')


    }) 

    //*If city is already chosen and country is updated, then city choice should be removed

    it('Check that city is removed after country update', () => {
        cy.get('#country').select('Estonia')
        cy.get('#city').select('Tallinn')
        cy.get('#country').select('Spain')
        cy.get('#city').should('not.be.checked')

    })

    //* add file (google yourself for solution)

    it('Check that file can be added', () => {
        cy.get('input[type=file]').selectFile('load_this_file_reg_form_3.txt')
        cy.get('input[type="submit"]').first().click()

    })

})

function mandatoryFields() {
        cy.get('#name').type('John')
        cy.get('[ng-model="email"]').type('john@email.com')
        cy.get('#country').select('Spain')
        cy.get('#city').select('Malaga')
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('#birthday').type('1990-01-10')
        cy.get('[type=checkbox]').first().click()
}
