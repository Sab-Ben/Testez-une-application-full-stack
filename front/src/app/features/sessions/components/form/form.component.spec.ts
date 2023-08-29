import {HttpClientTestingModule} from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule} from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { of } from "rxjs";
import {Session} from "../../interfaces/session.interface";

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let snackBar: MatSnackBar;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let router: Router;

  const mockSessionInformation = {
    admin: true,
    token: 'token',
    id: 1,
    username: 'username',
    firstName: 'firstName',
    lastName: 'lastName',
    type: 'type',
  };

  const session = {
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
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [
        RouterTestingModule.withRoutes([
          { path: 'update', component: FormComponent },
        ]),
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule, 
        MatSnackBarModule,
        MatSelectModule,
        NoopAnimationsModule
      ],
      providers: [
          {
          provide: SessionService, useValue: {sessionInformation: mockSessionInformation},
          },
        ],
      declarations: [FormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    snackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to the sessions page', () => {
    const spy = jest
        .spyOn(router, 'navigate')
        .mockImplementation(async () => true);
    const modifiedSessionInformation = {
      ...mockSessionInformation,
      admin: false,
    };
    sessionService.sessionInformation = modifiedSessionInformation;

    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(['/sessions']);
  });

  it('should show an error message when the form is empty', () => {
    const formElement: HTMLElement = fixture.nativeElement;
    const submitButton = formElement.querySelector<HTMLButtonElement>(
        'button[type="submit"]'
    );
    if (!submitButton) {
      throw new Error('Submit button not found');
    }

    submitButton.click();
    fixture.detectChanges();

    expect(
        formElement.querySelectorAll('mat-form-field.ng-invalid')
    ).toHaveLength(4);
  });

  it('should get the values of the sessions', async () => {
    jest.spyOn(router, 'url', 'get').mockReturnValue('/update');
    jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(session));
    component.ngOnInit();

    expect(router.url).toBe('/update');
    expect(component.sessionForm?.value.name).toEqual(session.name);
    expect(component.onUpdate).toBe(true);
  });

  it('should submit an update form', () => {
    component.onUpdate = true;
    const sessionApiUpdateSpy = jest
        .spyOn(sessionApiService, 'update')
        .mockReturnValue(of(session));
    const snackBarSpy = jest.spyOn(snackBar, 'open');
    const routerSpy = jest
        .spyOn(router, 'navigate')
        .mockImplementation(async () => true);

    component.submit();

    expect(sessionApiUpdateSpy).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should submit a create form', () => {
    component.onUpdate = false;
    const sessionApiCreateSpy = jest
        .spyOn(sessionApiService, 'create')
        .mockReturnValue(of(session));
    const snackBarSpy = jest.spyOn(snackBar, 'open');
    const routerSpy = jest
        .spyOn(router, 'navigate')
        .mockImplementation(async () => true);

    component.submit();

    expect(sessionApiCreateSpy).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['sessions']);
  });
});
