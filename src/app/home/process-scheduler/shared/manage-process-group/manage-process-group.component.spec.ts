import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProcessGroupComponent } from './manage-process-group.component';

describe('ManageProcessGroupComponent', () => {
  let component: ManageProcessGroupComponent;
  let fixture: ComponentFixture<ManageProcessGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageProcessGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProcessGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
