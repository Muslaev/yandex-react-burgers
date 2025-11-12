describe('Burger Constructor', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.login();
        cy.visit('/');
        cy.wait('@getIngredients');
    });

    it('should add bun and ingredient to constructor', () => {
        cy.get('[data-testid="ingredient-card"]')
            .contains('Краторная булка N-200i')
            .parents('[data-testid="ingredient-card"]')
            .as('bunCard');

        cy.get('[data-testid="ingredient-card"]')
            .contains('Биокотлета из марсианской Магнолии')
            .parents('[data-testid="ingredient-card"]')
            .as('meatCard');

        cy.get('@bunCard').trigger('dragstart');
        cy.get('[data-testid="constructor-drop-target"]').trigger('drop');
        cy.get('[data-testid="bun-top"]').should('contain', 'Краторная булка N-200i');
        cy.get('[data-testid="bun-bottom"]').should('contain', 'Краторная булка N-200i');

        cy.get('@meatCard').trigger('dragstart');
        cy.get('[data-testid="constructor-drop-target"]').trigger('drop');
        cy.get('[data-testid="constructor-ingredient"]').should('have.length', 1);
    });

    it('should open and close ingredient modal with correct data', () => {
        cy.get('[data-testid="ingredient-card"]')
            .contains('Соус Spicy-X')
            .parents('[data-testid="ingredient-card"]')
            .as('sauceCard');
        cy.get('@sauceCard').click();

        cy.get('[data-testid="modal"]').should('be.visible');

        cy.get('[data-testid="modal-title"]').should('contain', 'Детали ингредиента');

        cy.get('[data-testid="ingredient-name"]').should('contain', 'Соус Spicy-X');

        cy.get('[data-testid="modal-calories"]').should('contain', '30');
        cy.get('[data-testid="modal-proteins"]').should('contain', '30');
        cy.get('[data-testid="modal-fat"]').should('contain', '20');
        cy.get('[data-testid="modal-carbs"]').should('contain', '40');


        cy.get('[data-testid="modal-overlay"]').click({ force: true });
        cy.get('[data-testid="modal"]').should('not.exist');

        cy.get('@sauceCard').click();
        cy.get('[data-testid="modal"]').should('be.visible');
        cy.get('body').type('{esc}');
        cy.get('[data-testid="modal"]').should('not.exist');
    });
});