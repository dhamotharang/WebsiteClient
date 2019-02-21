import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NhTimeComponent } from './nh-time.component';

describe('NhTimeComponent', () => {
  let component: NhTimeComponent;
  let fixture: ComponentFixture<NhTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NhTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NhTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
