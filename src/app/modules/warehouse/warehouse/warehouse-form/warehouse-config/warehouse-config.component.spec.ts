import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseConfigComponent } from './warehouse-config.component';

describe('WarehouseConfigComponent', () => {
  let component: WarehouseConfigComponent;
  let fixture: ComponentFixture<WarehouseConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
