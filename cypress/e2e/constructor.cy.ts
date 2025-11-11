describe('Burger Constructor', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.login();
        cy.visit('/');
        cy.wait('@getIngredients');
    });

    it('should add bun and ingredient', () => {
        cy.contains('Краторная булка').trigger('dragstart');
        cy.get('[data-testid="constructor-drop-target"]').trigger('drop');
        cy.get('[data-testid="bun-top"]').should('contain', 'Краторная булка');

        cy.contains('Биокотлета').trigger('dragstart');
        cy.get('[data-testid="constructor-drop-target"]').trigger('drop');
        cy.get('[data-testid="constructor-ingredient"]').should('have.length', 1);
    });
});