import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GhmFileUploadComponent } from './ghm-file-upload.component';

describe('GhmFileUploadComponent', () => {
  let component: GhmFileUploadComponent;
  let fixture: ComponentFixture<GhmFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GhmFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhmFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
