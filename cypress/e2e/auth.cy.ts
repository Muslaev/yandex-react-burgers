describe('Auth Flow', () => {
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

        cy.intercept('POST', '/api/auth/register', {
            fixture: 'auth/register-success.json',
        }).as('register');

        cy.intercept('POST', '/api/auth/login', {
            fixture: 'auth/login-success.json',
        }).as('login');

        cy.intercept('POST', '/api/auth/logout', { success: true }).as('logout');

        cy.clearCookies();
        cy.window().then((win) => win.localStorage.clear());
    });

    it('should register and go to profile', () => {
        cy.visit('/register');

        cy.get('input[name="name"]').type('Test User');
        cy.get('input[name="email"]').type('test@test.com');
        cy.get('input[name="password"]').type('123456');
        cy.get('button[type="submit"]').click();

        cy.wait('@register');
        cy.setCookie('accessToken', 'fake-access-token-123');
        cy.window().then((win) => {
            win.localStorage.setItem('refreshToken', 'fake-refresh-token-456');
        });

        cy.visit('/');
        cy.visit('/profile');
        cy.wait('@fetchUser');
        cy.contains('Выход').should('be.visible');
    });

    it('should login, go to profile and logout', () => {
        cy.login('test@test.com', '123456');

        cy.visit('/profile');
        cy.wait('@fetchUser');

        cy.contains('Выход').click();
        cy.wait('@logout');
        cy.url().should('include', '/login');
    });
});