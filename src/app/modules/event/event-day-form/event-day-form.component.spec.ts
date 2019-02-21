import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDayFormComponent } from './event-day-form.component';

describe('EventDayFormComponent', () => {
  let component: EventDayFormComponent;
  let fixture: ComponentFixture<EventDayFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventDayFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
