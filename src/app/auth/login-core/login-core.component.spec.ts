import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCoreComponent } from './login-core.component';

describe('LoginCoreComponent', () => {
  let component: LoginCoreComponent;
  let fixture: ComponentFixture<LoginCoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginCoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
