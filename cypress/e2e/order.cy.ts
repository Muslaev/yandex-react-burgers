describe('Order Flow', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('POST', '/api/orders', { fixture: 'order/success.json' }).as('createOrder');
        cy.login();
        cy.visit('/');
        cy.wait('@getIngredients');
    });

    it('should create order and show modal', () => {
        cy.contains('Краторная булка').trigger('dragstart');
        cy.get('[data-testid="constructor-drop-target"]').trigger('drop');

        cy.contains('Биокотлета').trigger('dragstart');
        cy.get('[data-testid="constructor-drop-target"]').trigger('drop');

        cy.contains('Оформить заказ').click();
        cy.wait('@createOrder');

        cy.get('[data-testid="modal"]').should('be.visible');
        cy.get('[data-testid="order-number"]').should('contain', '34536');
        cy.get('[data-testid="modal-close"]').click();
        cy.get('[data-testid="modal"]').should('not.exist');
    });
});