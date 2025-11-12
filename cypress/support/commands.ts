/// <reference types="cypress" />

Cypress.Commands.add('login', (email = 'test@test.com', password = '123456') => {
    cy.intercept('POST', '/api/auth/login', {
        fixture: 'auth/login-success.json',
    }).as('login');

    cy.visit('/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.wait('@login');

    cy.setCookie('accessToken', 'fake-access-token-123');
    cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'fake-refresh-token-456');
    });
});