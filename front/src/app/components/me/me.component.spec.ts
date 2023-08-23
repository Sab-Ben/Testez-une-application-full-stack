import {HttpClientTestingModule} from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';

import { MeComponent } from './me.component';
import {RouterTestingModule} from "@angular/router/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {UserService} from "../../services/user.service";
import {of} from "rxjs";
import { Router } from "@angular/router";


describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let snackBar: MatSnackBar;
  let router: Router;

  const creationDate = new Date();

  const user = {
    id: 1,
    email: 'toto@test.com',
    lastName: 'Test',
    firstName: 'Toto',
    admin: false,
    password: '15973',
    createdAt: creationDate,
  };

  beforeEach(async () => {
    // @ts-ignore
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [{
        provide: SessionService, useValue: {
          sessionInformation: {
            id: 1,
          },
          logOut: () => {
          },
        },
      },
        {
          provide: UserService,
          useValue: {
            getById: () => of(user),
            delete: () => of({}),
          },
      }],
    })
      .compileComponents();
    snackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // @ts-ignore
    expect(component).toBeTruthy();
  });

  it('should go back to the previous page', () => {
    jest.spyOn(window.history, 'back').mockImplementation(() => {});
    component.back();
    // @ts-ignore
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should get user information on init', () => {
    expect(component.user).toBeTruthy();
    expect(component.user).toEqual({
      id: 1,
      email: 'toto@test.com',
      lastName: 'Test',
      firstName: 'Toto',
      admin: false,
      password: '15973',
      createdAt: creationDate,
    });
    fixture.detectChanges();
  });

  it('should delete user', () => {
    const routerSpy = jest
        .spyOn(router, 'navigate')
        .mockImplementation(async () => true);

    const snackBarSpy = jest.spyOn(snackBar, 'open');

    component.delete();

    expect(snackBarSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });
});
