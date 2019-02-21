import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GhmNewFolderComponent } from './ghm-new-folder.component';

describe('GhmNewFolderComponent', () => {
  let component: GhmNewFolderComponent;
  let fixture: ComponentFixture<GhmNewFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GhmNewFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhmNewFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
