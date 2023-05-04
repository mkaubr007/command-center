import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageArgumentsComponent } from './manage-arguments.component';

describe('ManageArgumentsComponent', () => {
  let component: ManageArgumentsComponent;
  let fixture: ComponentFixture<ManageArgumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageArgumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageArgumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
