describe('Auth Flow', () => {
    beforeEach(() => {
        cy.intercept('POST', '/api/auth/register', {
            fixture: 'auth/login-success.json',
        }).as('register');
    });

    it('should register and redirect to login', () => {
        cy.visit('/register');
        cy.get('input[name="name"]').type('Test User');
        cy.get('input[name="email"]').type('test@test.com');
        cy.get('input[name="password"]').type('123456');
        cy.get('button[type="submit"]').click();
        cy.wait('@register');
        cy.url().should('include', '/login');
    });
});