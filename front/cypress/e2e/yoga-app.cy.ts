describe('full client flow', () => {
  before(() => {
    cy.server();
  })
  // auth
  it('should register', () => {
    cy.visit('/');
    cy.get('[routerlink]').contains('Register').click();

    cy.route('POST', '/api/auth/register', {});

    cy.get('input[formControlName=firstName]').type('firstName');
    cy.get('input[formControlName=lastName]').type('lastName');
    cy.get('input[formControlName=email]').type('test@test.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/login');
  });

  // sessions
  it('should login and see the session list', () => {
    cy.visit('/login');
    cy.server()
    cy.route('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    cy.server()
    cy.route('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: 'Session 1',
          description: 'Lorem ipsum dolor sit amet. ' +
              'Est incidunt omnis aut tenetur quasi ut ullam autem qui sunt iure. ' +
              'sed impedit quia id fuga galisum. Eum rerum doloribus quo ' +
              'dolorem culpa est rerum voluptas aut voluptas temporibus aut dolorem minima?',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          teacher_id: 1,
          users: [1, 2, 3],
        },
        {
          id: 2,
          name: 'Session 2',
          description: 'Lorem ipsum dolor sit amet. ' +
              'Non dicta assumenda qui nobis itaque id nostrum illum sit ' +
              'omnis excepturi id earum quidem aut assumenda provident rem laborum adipisci. ' +
              'Sed numquam sunt aut rerum atque qui dolorem voluptatibus non autem labore ' +
              'At laudantium tempore aut eius atque sed deserunt animi.',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          teacher_id: 1,
          users: [1, 2, 4],
        },
      ],
    });
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(`${'test!1234'}{enter}{enter}`);
    cy.url().should('include', '/sessions')
  });

  it('should see the details of a session', () => {
    cy.route('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Session 1',
        description: 'Lorem ipsum dolor sit amet. ' +
            'Est incidunt omnis aut tenetur quasi ut ullam autem qui sunt iure. ' +
            'sed impedit quia id fuga galisum. Eum rerum doloribus quo ' +
            'dolorem culpa est rerum voluptas aut voluptas temporibus aut dolorem minima?',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        teacher_id: 1,
        users: [1, 2, 3]
      },
    }).as('session');

    cy.route('GET', '/api/teacher/1', {
      body:{
        id: 1,
        lastName: 'Ben',
        firstName: 'Sab',
        createdAt: new Date(),
        updatedAt: new Date(),
        },
    }).as('teacher');

    cy.route('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: 'Session 1',
          description: 'Lorem ipsum dolor sit amet. ' +
              'Est incidunt omnis aut tenetur quasi ut ullam autem qui sunt iure. ' +
              'sed impedit quia id fuga galisum. Eum rerum doloribus quo ' +
              'dolorem culpa est rerum voluptas aut voluptas temporibus aut dolorem minima?',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          teacher_id: 1,
          users: [1, 2, 3],
        },
        {
          id: 2,
          name: 'Session 2',
          description: 'Lorem ipsum dolor sit amet. ' +
              'Non dicta assumenda qui nobis itaque id nostrum illum sit ' +
              'omnis excepturi id earum quidem aut assumenda provident rem laborum adipisci. ' +
              'Sed numquam sunt aut rerum atque qui dolorem voluptatibus non autem labore ' +
              'At laudantium tempore aut eius atque sed deserunt animi.',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          teacher_id: 1,
          users: [1, 2, 4],
        },
      ]
    }).as('sessions');

    cy.get('mat-card-actions button').first().click();
    cy.url().should('include', '/sessions/detail/1');
    cy.get('h1').contains('Session 1');
    cy.get('div.description').contains('Lorem ipsum dolor sit amet. ' +
        'Est incidunt omnis aut tenetur quasi ut ullam autem qui sunt iure. ' +
        'sed impedit quia id fuga galisum. Eum rerum doloribus quo ' +
        'dolorem culpa est rerum voluptas aut voluptas temporibus aut dolorem minima?');
    cy.get('mat-card-subtitle').contains('Sab BEN')
  });

  it('should unenroll from a session', () => {
    cy.route('DELETE', '/api/session/1/participate/1', {});
    cy.route('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Session 1',
        description: 'Lorem ipsum dolor sit amet. ' +
            'Est incidunt omnis aut tenetur quasi ut ullam autem qui sunt iure. ' +
            'sed impedit quia id fuga galisum. Eum rerum doloribus quo ' +
            'dolorem culpa est rerum voluptas aut voluptas temporibus aut dolorem minima?',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        teacher_id: 1,
        users: [1, 2, 3], },
    }).as('session');

    cy.get('button').contains('Do not participate').should('exist');
    cy.get('button').contains('Do not participate').click();

    cy.get('button').contains('Participate').should('exist');
    cy.get('button').contains('Do not participate').should('not.exist');

    cy.get('div').contains('attendees').should('contain', '2');
  });

  it('should enroll to a session', () => {
    cy.route('POST', '/api/session/1/participate/1', {});
    cy.route('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Session 1',
        description: 'Lorem ipsum dolor sit amet. ' +
            'Est incidunt omnis aut tenetur quasi ut ullam autem qui sunt iure. ' +
            'sed impedit quia id fuga galisum. Eum rerum doloribus quo ' +
            'dolorem culpa est rerum voluptas aut voluptas temporibus aut dolorem minima?',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        teacher_id: 1,
        users: [1, 2, 3],
      },
    }).as('session');

    cy.get('button').contains('Participate').should('exist');
    cy.get('button').contains('Participate').click();

    cy.get('button').contains('Participate').should('not.exist');
    cy.get('button').contains('Do not participate').should('exist');

    cy.get('div').contains('attendees').should('contain', '3');
  });

  it('should come back to the sessions list', () => {
    cy.get('button').first().click();
    cy.url().should('include', '/sessions');
  });

  // Account page
  it('should visit the account page', () => {
    cy.route('GET', '/api/user/1', {
      id: 1,
      email: 'mock@test.com',
      lastName: 'Test',
      firstName: 'Toto',
      admin: false,
      password: '15973',
      createdAt: new Date(),
    });

    cy.get('.link').contains('Account').click();
    cy.url().should('include', '/me');

    // should have the user information
    cy.get('p').contains('Toto Test').should('exist');
    cy.get('p').contains('Email: mock@test.com').should('exist');
  });

  // Logout
  it('should logout', () => {
    cy.get('.link').contains('Logout').click();
    cy.url().should('contain', '/');
  });

  // Not Found
  it('should redirect to the not found page', () => {
    cy.visit('/notavalidurlforsure');
    cy.url().should('contain', '/404');
  });
});

describe('admin flow', () => {

  it('should login as admin', () => {
    cy.visit('/login');
    cy.server();
    cy.route('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

    cy.route('GET', '/api/session', []).as('session')
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    cy.url().should('include', '/sessions');
  });

  it('creates a new session', () => {
    cy.route('GET', '/api/teacher', {
      body: [
        {
          id: 1,
          lastName: 'Ben',
          firstName: 'Sab',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          lastName: 'Doe',
          firstName: 'Jane',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    });
    cy.get('button').contains('Create').click();
    cy.url().should('include', '/sessions/create');

    cy.route('POST', '/api/session', {
      body: {
        id: 3,
        name: 'New session',
        description: 'New session description',
        teacher: 1,
        users: [],
      },
    }).as('session');

    cy.route('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: 'Session 1',
          description: 'Lorem ipsum dolor sit amet. ' +
              'Est incidunt omnis aut tenetur quasi ut ullam autem qui sunt iure. ' +
              'sed impedit quia id fuga galisum. Eum rerum doloribus quo ' +
              'dolorem culpa est rerum voluptas aut voluptas temporibus aut dolorem minima?',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          teacher_id: 1,
          users: [1, 2, 3],
        },
        {
          id: 2,
          name: 'Session 2',
          description: 'Lorem ipsum dolor sit amet. ' +
              'Non dicta assumenda qui nobis itaque id nostrum illum sit ' +
              'omnis excepturi id earum quidem aut assumenda provident rem laborum adipisci. ' +
              'Sed numquam sunt aut rerum atque qui dolorem voluptatibus non autem labore ' +
              'At laudantium tempore aut eius atque sed deserunt animi.',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          teacher_id: 1,
          users: [1, 2, 4],
        },
        {
          id: 3,
          name: 'New session',
          description: 'New session description',
          teacher: 1,
          users: [],
        },
      ],
    }).as('sessions');

    cy.get('input[formControlName=name]').type('New session');
    // set the date by clicking on the calendar
    cy.get('input[formControlName=date]').type('2023-06-15');
    // set the time by clicking on the clock
    cy.get('textarea[formControlName=description]').type(
        'New session description'
    );
    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('mat-option').contains('Sab Ben').click();

    cy.get('button').contains('Save').click();
  });

  it('should see the new session in the list', () => {
    cy.get('.item').should('have.length', 3);
    cy.get('.item').contains('New session').should('exist');
  });

  // Continuer ?
  it('should see the details of the new session', () => {
    cy.route('GET', '/api/session/3', {
      body: {
        id: 3,
        name: 'New session',
        description: 'New session description',
        teacher: 1,
        users: [],
      },
    }).as('session');

    cy.route('GET', '/api/teacher/1', {
      body: {
        id: 1,
        lastName: 'Ben',
        firstName: 'Sab',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }).as('teacher');

    cy.get('mat-card').last().contains('Detail').last().click();
    cy.url().should('include', '/sessions/detail/3');

    cy.get('div').contains('New session description').should('exist');
  });

  it("should delete the new session and see it doesn't exist anymore", () => {
    cy.route('DELETE', '/api/session/3', {});
    cy.route('GET', '/api/session', {
      body: [{
        id: 1,
        name: 'Session 1',
        description: 'Lorem ipsum dolor sit amet. ' +
            'Est incidunt omnis aut tenetur quasi ut ullam autem qui sunt iure. ' +
            'sed impedit quia id fuga galisum. Eum rerum doloribus quo ' +
            'dolorem culpa est rerum voluptas aut voluptas temporibus aut dolorem minima?',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        teacher_id: 1,
        users: [1, 2, 3],
        },
        {
          id: 2,
          name: 'Session 2',
          description: 'Lorem ipsum dolor sit amet. ' +
              'Non dicta assumenda qui nobis itaque id nostrum illum sit ' +
              'omnis excepturi id earum quidem aut assumenda provident rem laborum adipisci. ' +
              'Sed numquam sunt aut rerum atque qui dolorem voluptatibus non autem labore ' +
              'At laudantium tempore aut eius atque sed deserunt animi.',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          teacher_id: 1,
          users: [1, 2, 4],
        },],
    }).as('sessions');

    cy.get('button').contains('Delete').click();

    cy.url().should('contain', '/sessions');
    cy.get('.item').should('have.length', 2);
    cy.get('.item').contains('New session').should('not.exist');
  });
});