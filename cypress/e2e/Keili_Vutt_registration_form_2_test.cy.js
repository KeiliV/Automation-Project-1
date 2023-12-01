
//My function for filling all mandatory fields
function fillMandatoryFields(password, confirmPassword) {
    cy.get('#username').type('johnDoe')
    cy.get('#email').type('keili@example.com')
    cy.get('[data-cy="name"]').type('John')
    cy.get('[data-testid="lastNameTestId"]').type('Doe')
     cy.get('[data-testid="phoneNumberTestId"]').type('12345678')
    cy.get('[name="password"]').type(password)
    cy.get('[name="confirm"]').type(confirmPassword)
}

beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_2.html')
})

/*
Assignement 4: add content to the following tests
*/

describe('Section 1: Functional tests', () => {

    it('User can only use same both first and validation passwords', ()=>{
        // Add test steps for filling in ONLY mandatory fields -> using a function defined on top of this page
        // Fill in password & confirm password with different data
        fillMandatoryFields('Password123', '345Password')
     
        // Click on some other field or element on the page to activate the assertion of the password matching 
        cy.get('h2').contains('Password').click()

        // Assert that error message is visible
        cy.get('#password_error_message').should('be.visible').should('contain', 'Passwords do not match!')
        // Assert that submit button is disabled
        cy.get('.submit_button').should('be.disabled')

        //Change the confirm password to match the password
        cy.get('[name="confirm"]').clear().type('Password123')
        cy.get('h2').contains('Password').click()
        
        // Assert that password error message is not visible
        cy.get('#password_error_message').should('not.be.visible')
        // Assert that submit button is enabled
        cy.get('.submit_button').should('be.enabled')
    })
    

    it('User can submit the form when all fields are added', ()=>{
        // Adding test steps for filling in ALL fields
        cy.get('#username').type('johnDoe')
        cy.get('#email').type('keili@example.com')
        cy.get('[data-cy="name"]').type('John')
        cy.get('[data-testid="lastNameTestId"]').type('Doe')
        cy.get('[data-testid="phoneNumberTestId"]').type('12345678')
        cy.get('#cssFavLanguage').type('radio')
        cy.get('#vehicle1').type('checkbox')
        cy.get('#cars').select('Saab')
        cy.get('#animal').select('cow')
        cy.get('[name="password"]').type('Password123')
        cy.get('[name="confirm"]').type('Password123')

        //Click on some other element to activate submit button
        cy.get('h2').contains('Password').click()

        // Assert that submit button is enabled and click on it
        cy.get('.submit_button').should('be.enabled')
        cy.get('.submit_button').click()

        // Assert that after submitting the form system shows a successful message
        cy.get('#success_message').should('be.visible').should('contain', 'User successfully submitted registration')
    })


    it('User can submit the form with valid data and only mandatory fields added', ()=>{
        // Add test steps for filling in only mandatory fields
        fillMandatoryFields('Password123', 'Password123')

        //Click on some other element to activate submit button
        cy.get('h2').contains('Password').click()

        // Assert that submit button is enabled and click on it
        cy.get('.submit_button').should('be.enabled')
        cy.get('.submit_button').click()

        // Assert that after submitting the form system shows successful message
        cy.get('#success_message').should('be.visible').should('contain', 'User successfully submitted registration')

    })

    it('User cannot submit the form when username is absent', ()=>{
        // Fill all mandatory fields
        fillMandatoryFields('Password123', 'Password123')

        // Clear mandatory usernamme field
        cy.get('#username').clear() 
        //Click on some other element to activate error assertion
        cy.get('h2').contains('Password').click()

        // Assert that Submit button is disabled
        cy.get('.submit_button').should('be.disabled')
 
        // Assert that correct error message is visible and contains given text
        cy.get('#input_error_message').should('be.visible').should('contain', 'Mandatory input field is not valid or empty!')

    })   
    
})

/*
Assignement 5: create more visual tests
*/

describe('Section 2: Visual tests', () => {
    it('Check that logo is correct and has correct size', () => {
        cy.log('Will check CH logo source and size')
        cy.get('img').should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
        // get element and check its parameter height, to less than 178 and greater than 100
        cy.get('img').invoke('height').should('be.lessThan', 178)
            .and('be.greaterThan', 100)   
    })

    it('Check that second picture is correct and has correct size', () => {
        // Create similar test for checking the second picture
        cy.log('Will check Cypress logo source and size')
        cy.get('img').eq(1).should('have.attr', 'src').should('include', 'cypress_logo')
        cy.get('img').eq(1).invoke('height').should('be.lessThan', 116)
            .and('be.greaterThan', 80)

    });

    it('Check the first link in the navigation bar', () => {
        cy.get('nav').children().should('have.length', 2)

        // Get navigation element, find siblings that contains h1 and check if it has Registration form in string
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        
        // Get navigation element, find its first child, check the link content and click it
        cy.log('Will check that first link is to Registration form 1')
        cy.get('nav').children().eq(0).should('be.visible')
            .and('have.attr', 'href', 'registration_form_1.html')
            .click()
        
        // Check that currently opened URL is correct
        cy.url().should('contain', '/registration_form_1.html')
        
        // Go back to previous page
        cy.go('back')
        cy.log('Back again in registration form 2')
    })

    // Create similar test for checking the second link 
    it('Check the second link in the navigation bar', () => {
        
        // Get navigation element, find its second child, check the link content and click it
        cy.log('Will check that second link is to Registration form 3')
        cy.get('nav').children().eq(1).should('be.visible')
            .and('have.attr', 'href', 'registration_form_3.html')
            .click()

        // Check that currently opened URL is correct
        cy.url().should('contain', '/registration_form_3.html')
        
        // Go back to previous page
        cy.go('back')
        //Checking that the URL we went back to is Registration form 2's URL
        cy.url().should('contain', '/registration_form_2.html')
    })


    it('Check that radio button list is correct', () => {
        // Array of found elements with given selector has 4 elements in total
        cy.get('input[type="radio"]').should('have.length', 4)

        // Verify labels of the radio buttons
        cy.get('input[type="radio"]').next().eq(0).should('have.text','HTML')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','CSS')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','JavaScript')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','PHP')

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

    // Create test similar to previous one verifying check boxes

    it('Check that checkbox list is correct', () => {
        // Array of found elements with given selector has 3 elements in total
        cy.get('input[type="checkbox"]').should('have.length', 3)

        // Verify labels of the checkboxes
        cy.get('input[type="checkbox"]').next().eq(0).should('have.text','I have a bike')
        cy.get('input[type="checkbox"]').next().eq(1).should('have.text','I have a car')
        cy.get('input[type="checkbox"]').next().eq(2).should('have.text','I have a boat')

        //Verify default state of checkboxes
        cy.get('input[type="checkbox"]').eq(0).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(1).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(2).should('not.be.checked')

        // Multiple checkboxes can be chosen
        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(0).should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).should('be.checked')
    })

    it('Car dropdown is correct', () => {
        // Here is an example how to explicitely create screenshot from the code
        // Select second element and create screenshot for this area, and full page
        cy.get('#cars').select(1).screenshot('Cars drop-down')
        cy.screenshot('Full page screenshot')

        // Here are given different solutions how to get the length of array of elements in Cars dropdown
        // Next 2 lines of code do exactly the same!
        cy.get('#cars').children().should('have.length', 4)
        cy.get('#cars').find('option').should('have.length', 4)
        
        //Check  that first element in the dropdown has text Volvo
        cy.get('#cars').find('option').eq(0).should('have.text', 'Volvo')
        
        // Advanced level how to check the content of the Cars dropdown
        cy.get('#cars').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['volvo', 'saab', 'opel', 'audi'])
        })
    })


    // Create test similar to previous one

    it('Animal dropdown is correct', () => {
        //Check he length of array of elements in Animal dropdown
        cy.get('#animal').children().should('have.length', 6)
        
        // Check the content of the Animal dropdown
        cy.get('#animal').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['dog', 'cat', 'snake', 'hippo', 'cow', 'mouse'])
        })
    })


})

//Example function provided by Cerebrum Hub
function inputValidData(username) {
    cy.log('Username will be filled')
    cy.get('input[data-testid="user"]').type(username)
    cy.get('#email').type('validemail@yeap.com')
    cy.get('[data-cy="name"]').type('John')
    cy.get('#lastName').type('Doe')
    cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
    // If element has multiple classes, then one of them can be used
    cy.get('#password').type('MyPass')
    cy.get('#confirm').type('MyPass')
    cy.get('h2').contains('Password').click()
}