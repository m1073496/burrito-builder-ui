describe('Burrito Builder', () => {

  describe('App', () => {

    it('Should display all relevant components', () => {
      cy.visit('http://localhost:3000');

      cy.get('[data-cy=title]').should('exist');
      cy.get('[data-cy=order-form]').should('exist');
      cy.get('[data-cy=order-container]').should('exist');
    });

    it('Should display orders fetched from database', () => {
      cy.intercept({
          method: 'GET',
          url:'http://localhost:3001/api/v1/orders'
        },
        {
          statusCode: 200,
          body: {orders: [{ id: 1, name: 'slenderman', ingredients: ['chocolate'] }]}
        });
      cy.visit('http://localhost:3000');

      cy.get('[data-cy=order-container]').contains('slenderman');
      cy.get('[data-cy=order-container]').contains('chocolate');
    });

    it('Should not display orders if there was a network request error', () => {
      cy.intercept({
          method: 'GET',
          url:'http://localhost:3001/api/v1/orders'
        },
        {
          statusCode: 500,
        });
      cy.visit('http://localhost:3000');

      cy.get('[data-cy=order-container]').contains('No orders yet!');
    });

  });


  describe('Order Form', () => {

    beforeEach(() => {
      cy.intercept({
          method: 'GET',
          url:'http://localhost:3001/api/v1/orders'
        },
        {
          statusCode: 200,
          body: {orders: [{ id: 1, name: 'slenderman', ingredients: ['chocolate'] }]}
        });
      cy.visit('http://localhost:3000');
    })

    it('Should display name, ingredient input options & submit button', () => {
      cy.get('input[placeholder=Name]').should('exist');

      const possibleIngredients = ['beans', 'steak', 'carnitas', 'sofritas', 'lettuce', 'queso fresco', 'pico de gallo', 'hot sauce', 'guacamole', 'jalapenos', 'cilantro', 'sour cream'];
      possibleIngredients.forEach(ingredient => {
        cy.get('button').contains(`${ingredient}`);
      });

      cy.get('[data-cy=submit-button]').should('exist');
    });

    it('Should allow a user to submit a valid order', () => {
      cy.intercept({
        method: 'POST',
        url:'http://localhost:3001/api/v1/orders'
      },
      {
        statusCode: 200,
        body: {
          name: 'man of slender stature',
          ingredients: ['beans'],
          id: 2000
        }
      });

      cy.get('input[placeholder=Name]').type('man of slender stature');
      cy.get('button').contains('beans').click();
      cy.get('[data-cy=submit-button]').click();
      cy.get('[data-cy=order-container]').contains('man of slender stature');
      cy.get('[data-cy=order-container]').contains('beans');

    });

    it('Should not allow a user to submit an order with only a name', () => {
      cy.get('input[placeholder=Name]').type('the slimiest of slim jim shadies');
      cy.get('[data-cy=submit-button]').click();
      cy.get('[data-cy=order-container]').should('not.contain', 'the slimiest of slim jim shadies');
    });

    it('Should not allow a user to submit an order with only ingredients', () => {
      cy.get('button').contains('lettuce').click();
      cy.get('[data-cy=submit-button]').click();
      cy.get('[data-cy=order-container]').should('not.contain', 'lettuce');
    });

    it('Should not post an order if there is a network request error', () => {
      cy.intercept({
        method: 'POST',
        url:'http://localhost:3001/api/v1/orders'
      },
      {
        statusCode: 404,
      });

      cy.get('input[placeholder=Name]').type('the slimiest of slim jim shadies');
      cy.get('button').contains('steak').click();
      cy.get('[data-cy=submit-button]').click();
      cy.get('[data-cy=order-container]').should('not.contain', 'the slimiest of slim jim shadies');
      cy.get('[data-cy=order-container]').should('not.contain', 'steak');
    });

  });

});
