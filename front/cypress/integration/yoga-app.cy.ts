describe('user yoga-app', () => {
  // auth
  it('should register', () => {
    cy.visit('/');
    cy.get('[routerlink]').contains('Register').click();
    cy.server()
    cy.route('POST', '/api/auth/register', {});

    cy.get('input[formControlName=firstName]').type(`${'Sab'}`);
    cy.get('input[formControlName=lastName]').type(`${'Ben'}`);
    cy.get('input[formControlName=email]').type('sab_ben@gmail.com');
    cy.get('input[formControlName=password]').type(`${'password'}{enter}{enter}`);

    cy.url().should('include', '/login');
  });

  // sessions
  it('should login and see the session list page', () => {
    cy.visit('/');
    cy.get('[routerlink]').contains('Login').click();
    cy.server()
    cy.route('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false,
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
    cy.get('input[formControlName=email]').type('sab_ben@gmail.com');
    cy.get('input[formControlName=password]').type(`${'password'}{enter}{enter}`);
  });

  it('should see details session page', () => {

    cy.server()
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

    cy.server()
    cy.route('GET', '/api/teacher/1', {
      body:{
        id: 1,
        lastName: 'Ben',
        firstName: 'Sab',
        createdAt: new Date(),
        updatedAt: new Date(),
        },
    }).as('teacher');

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
      ]
    }).as('sessions');

    cy.get('[routerlink]').contains('Session').as('login').click();
    cy.url().should('include', 'sessions/detail/1');
    cy.get('h1').contains('Session 1');
    cy.get('div.description').contains('Lorem ipsum dolor sit amet. ' +
        'Est incidunt omnis aut tenetur quasi ut ullam autem qui sunt iure. ' +
        'sed impedit quia id fuga galisum. Eum rerum doloribus quo ' +
        'dolorem culpa est rerum voluptas aut voluptas temporibus aut dolorem minima?');
    cy.get('mat-card-subtitle').should('contain','Sab BEN')
  });

  it('should unenroll from a session', () => {
    cy.server()
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
    cy.server()
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
    cy.get('[routerlink]').contains('Sessions').as('login').click();
    cy.url().should('include', '/sessions');
  });

  // Account page
  it('should visit the account page', () => {
    cy.server()
    cy.route('GET', '/api/user/1', {
      id: 1,
      email: 'toto@test.com',
      lastName: 'Test',
      firstName: 'Toto',
      admin: false,
      password: '15973',
      createdAt: new Date(),
    });

    cy.get('.link').contains('Account').as('login').click();
    cy.url().should('include', '/me');
    cy.get('p').contains('Name : Toto Test').should('exist');
    cy.get('p').contains('Email : toto@test.com').should('exist');
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

describe('admin yoga-app', () => {
  // auth
    it('should login like admin', () => {
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

    it('create a new session', () => {
      cy.url().should('include', '/sessions');
      cy.server()
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

      cy.server()
      cy.route('POST', '/api/session', {
        body: {
          id: 3,
          name: 'New session',
          description: 'New session description',
          teacher: 1,
          users: [],
        },
      }).as('session');

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
          {
            id: 3,
            name: 'New session',
            description: 'New session description',
            date: new Date(),
            teacher_id: 1,
            users: [],
          },
        ],
      }).as('sessions');

      cy.get('button[routerLink=create]').contains('Create').click();
      cy.get('input[formControlName=name]').type('New session');
      cy.get('input[formControlName=date]').type('2023-06-15');
      cy.get('textarea[formControlName=description]').type(
          'New session description'
      );
      cy.get('mat-select[formControlName=teacher_id]').click();
      cy.get('mat-option').contains('Sab Ben').click();
      cy.get('button[type=submit]').contains('Save').click();
    });


    it('should see the new session in the list', () => {
      cy.get('mat-card-title').contains('New session').should('exist');
      cy.get('mat-card-subtitle').contains('2023-06-15').should('exist');
      cy.get('p').contains('New session description').should('exist');
    });


    it('should see the details of the new session', () => {
      cy.server()
      cy.route('GET', '/api/session/3', {
        body: {
          id: 3,
          name: 'New session',
          description: 'New session description',
          teacher: 1,
          users: [],
        },
      }).as('session');

      cy.server()
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
      cy.server()
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