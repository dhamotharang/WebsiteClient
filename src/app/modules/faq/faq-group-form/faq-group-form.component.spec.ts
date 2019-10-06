import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqGroupFormComponent } from './faq-group-form.component';

describe('FaqGroupFormComponent', () => {
  let component: FaqGroupFormComponent;
  let fixture: ComponentFixture<FaqGroupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqGroupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
