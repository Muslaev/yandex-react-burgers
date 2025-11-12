describe('Order Flow', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/auth/user', {
            statusCode: 200,
            body: {
                success: true,
                user: { email: 'test@test.com', name: 'Test User' },
            },
        }).as('fetchUser');

        cy.intercept('POST', '/api/auth/token', {
            statusCode: 200,
            body: {
                success: true,
                accessToken: 'Bearer fake-access-token-123',
                refreshToken: 'fake-refresh-token-456',
            },
        }).as('refreshToken');

        cy.intercept('POST', '/api/auth/login', {
            fixture: 'auth/login-success.json',
        }).as('login');

        cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('POST', '/api/orders', { fixture: 'order/success.json' }).as('createOrder');

        cy.clearCookies();
        cy.window().then((win) => win.localStorage.clear());
    });

    it('should create order and show modal', () => {

        cy.login();

        cy.setCookie('accessToken', 'fake-access-token-123');
        cy.window().then((win) => {
            win.localStorage.setItem('refreshToken', 'fake-refresh-token-456');
        });

        cy.visit('/profile');
        cy.wait('@fetchUser');
        cy.visit('/');

        cy.wait('@getIngredients');

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

        cy.get('@meatCard').trigger('dragstart');
        cy.get('[data-testid="constructor-drop-target"]').trigger('drop');
        cy.get('[data-testid="constructor-ingredient"]').should('have.length', 1);

        cy.get('button').contains('Оформить заказ').click();

        cy.get('input[name="email"]').type('test@test.com');
        cy.get('input[name="password"]').type('123456');
        cy.get('button[type="submit"]').click();
        cy.wait('@login');

        cy.setCookie('accessToken', 'fake-access-token-123');
        cy.window().then((win) => {
            win.localStorage.setItem('refreshToken', 'fake-refresh-token-456');
        });

        cy.get('button').contains('Оформить заказ').click();
        cy.wait('@createOrder');

        cy.get('[data-testid="modal"]').should('be.visible');
        cy.get('[data-testid="order-number"]').should('contain', '34536');

        cy.get('[data-testid="modal-overlay"]').click({ force: true });
        cy.get('[data-testid="modal"]').should('not.exist');

        cy.get('[data-testid="bun-top"]').should('not.exist');
    });
});