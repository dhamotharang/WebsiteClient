import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NhDropdownComponent } from './nh-dropdown.component';

describe('NhDropdownComponent', () => {
  let component: NhDropdownComponent;
  let fixture: ComponentFixture<NhDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NhDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NhDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
