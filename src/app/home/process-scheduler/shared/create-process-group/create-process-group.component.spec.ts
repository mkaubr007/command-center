import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProcessGroupComponent } from './create-process-group.component';

describe('CreateProcessGroupComponent', () => {
  let component: CreateProcessGroupComponent;
  let fixture: ComponentFixture<CreateProcessGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProcessGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProcessGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
