import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GhmInputComponent } from './ghm-input.component';

describe('GhmInputComponent', () => {
  let component: GhmInputComponent;
  let fixture: ComponentFixture<GhmInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GhmInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhmInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
