import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NhMenuItemComponent } from './nh-menu-item.component';

describe('NhMenuItemComponent', () => {
  let component: NhMenuItemComponent;
  let fixture: ComponentFixture<NhMenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NhMenuItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NhMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
