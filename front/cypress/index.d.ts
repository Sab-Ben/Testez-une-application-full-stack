/// <reference types="cypress" />

import {Session} from "../src/app/features/sessions/interfaces/session.interface";

declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(email: string, password: string, admin?: boolean): Chainable<any>;
    intercept(method : string, url: string, routeHandler: {}): Chainable<any>;
  }
}
