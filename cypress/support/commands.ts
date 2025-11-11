/// <reference types="cypress" />

Cypress.Commands.add('login', (email = 'mumbayOSK@yandex.ru', password = '123123') => {
    cy.intercept('POST', '/api/auth/login', {
        fixture: 'auth/login-success.json',
    }).as('login');

    cy.visit('/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.wait('@login');
    cy.url().should('include', '/');
});

Cypress.Commands.add('logout', () => {
    cy.intercept('POST', '/api/auth/logout', { success: true }).as('logout');
    cy.get('[data-testid="profile-link"]').click();
    cy.get('button').contains('Выйти').click();
    cy.wait('@logout');
    cy.url().should('include', '/login');
});