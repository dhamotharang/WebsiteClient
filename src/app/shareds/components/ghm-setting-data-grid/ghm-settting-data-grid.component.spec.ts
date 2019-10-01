import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GhmSetttingDataGridComponent } from './ghm-settting-data-grid.component';

describe('GhmSetttingDataGridComponent', () => {
  let component: GhmSetttingDataGridComponent;
  let fixture: ComponentFixture<GhmSetttingDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GhmSetttingDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhmSetttingDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
