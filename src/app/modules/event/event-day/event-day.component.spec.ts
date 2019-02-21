import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDayComponent } from './event-day.component';

describe('EventDayComponent', () => {
  let component: EventDayComponent;
  let fixture: ComponentFixture<EventDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
