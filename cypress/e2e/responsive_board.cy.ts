describe('Responsive Kanban Board', () => {
  beforeEach(() => {
    // Seed and login
    cy.request('POST', '/api/auth/seed');
    cy.visit('/login');
    cy.get('input[name="email"]').type('user@todo.dev');
    cy.get('input[name="password"]').type('ChangeMe123!');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');
  });

  it('should display columns in a row on desktop', () => {
    cy.viewport(1280, 720);
    // Find the container by finding a column header and going up
    cy.contains('h6', 'Backlog').closest('.MuiBox-root').parent().should('have.css', 'flex-direction', 'row');
  });

  it('should display columns in a column on mobile', () => {
    cy.viewport('iphone-x'); // 375 x 812
    cy.contains('h6', 'Backlog').closest('.MuiBox-root').parent().should('have.css', 'flex-direction', 'column');
  });
});
