import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NhMenuComponent } from './nh-menu.component';

describe('NhMenuComponent', () => {
  let component: NhMenuComponent;
  let fixture: ComponentFixture<NhMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NhMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NhMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
