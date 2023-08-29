import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers : [ UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user by id', () => {
    service.getById('1').subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.id).toBe(1);
      expect(response.firstName).toBe('Toto');
    });

    const request = httpMock.expectOne('api/user/1');
    expect(request.request.method).toEqual('GET');

    request.flush({
      id: 1,
      firstName: 'Toto',
      lastName: 'Test',
      email: 'toto@test.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should delete', () => {
    service.delete('1').subscribe((response) => {
      expect(response).toBe(undefined);
    });

    const request = httpMock.expectOne('api/user/1');
    expect(request.request.method).toEqual('DELETE');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
