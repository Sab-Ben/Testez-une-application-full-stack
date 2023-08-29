import { HttpClientModule } from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import {SessionService} from "./services/session.service";
import {of} from "rxjs";


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
      providers : [ { provide : SessionService, useValue: {$isLogged: () => of(true),
        logOut: () => {},
            },
          }]
        }).compileComponents();

      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have a logged header', () => {
    const links = fixture.nativeElement.querySelectorAll('span.link');
    expect(links.length).toBe(3);
  });

  it('should have a not logged header', () => {
    TestBed.inject(SessionService).$isLogged = () => of(false);

    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('span.link');
    expect(links.length).toBe(2);
  });

  it("should logout", () => {
    const spy = jest.spyOn(component, 'logout');
    const logOutSpan = fixture.nativeElement.querySelectorAll('span.link')[2];
    logOutSpan.click();
    expect(spy).toHaveBeenCalled();
  });
});
