import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import {Router} from "@angular/router";
import {of, throwError} from "rxjs";
import {AuthService} from "../../services/auth.service";
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form', () => {
    const form = fixture.nativeElement;
    const email = form.querySelector('input[formControlName="email"]');
    const password = form.querySelector('input[formControlName="password"]');
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();
  });

  it('should change when an input is not empty', () => {
    const formElement: HTMLElement = fixture.nativeElement;
    const email = formElement.querySelector('input[formControlName="email"]');

    (email as HTMLInputElement).focus();
    (email as HTMLInputElement).blur();

    const password = formElement.querySelector(
      'input[formControlName="password"]'
    );
    (password as HTMLInputElement).focus();
    (password as HTMLInputElement).blur();

    expect(email!.classList).toContain('ng-invalid');
    expect(password!.classList).toContain('ng-invalid');
  });

  it('should be ok', () => {
    const formElement: HTMLElement = fixture.nativeElement;
    const email: HTMLInputElement | null = formElement.querySelector(
      'input[formControlName="email"]'
    );

    if (!email) return;
    email.focus();
    email.blur();

    email.value = 'toto@test.com';
    email.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    expect(email.value).toBe('toto@test.com');
    expect(email.classList).toContain('ng-valid');
  });

  it('should have a submit button', () => {
    const formElement: HTMLElement = fixture.nativeElement;
    const submitButton = formElement.querySelector('button[type="submit"]');
    expect(submitButton).toBeTruthy();
    expect((submitButton as HTMLButtonElement).disabled).toBe(true);
  });

  it('should allow the submit button', () => {
    const formElement: HTMLElement = fixture.nativeElement;
    const submitButton = formElement.querySelector('button[type="submit"]');

    const email: HTMLInputElement = formElement.querySelector(
      'input[formControlName="email"]'
    ) as HTMLInputElement;

    email.value = 'toto@test.com';
    email.dispatchEvent(new Event('input'));

    const password = formElement.querySelector(
      'input[formControlName="password"]'
    ) as HTMLInputElement;

    password.value = '15973';
    password.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    expect((submitButton as HTMLButtonElement).disabled).toBe(false);
  });

  it('should show an error message', () => {
    component.onError = true;
    fixture.detectChanges();
    const formElement: HTMLElement = fixture.nativeElement;
    const errorMessage = formElement.querySelector('p.error');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage!.textContent).toContain('An error occurred');
  });

  it('should indicate error', () => {
    const authService = TestBed.inject(AuthService);
    const loginSpy = jest
      .spyOn(authService, 'login')
      .mockImplementation(() => throwError(() => new Error('err')));

    component.submit();
    expect(loginSpy).toHaveBeenCalled();
    expect(component.onError).toBe(true);
  });

  it('should navigate to the sessions page', () => {
    const authService = TestBed.inject(AuthService);

    const navigateSpy = jest
      .spyOn(router, 'navigate')
      .mockImplementation(async () => true);

    const authSpy = jest
      .spyOn(authService, 'login')
      .mockImplementation(() => of({} as SessionInformation));

    jest.spyOn(sessionService, 'logIn').mockImplementation(() => {});
    component.submit();
    expect(authSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });
});
