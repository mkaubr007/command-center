import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessHeaderDropdownComponent } from './process-header-dropdown.component';

describe('ProcessHeaderDropdownComponent', () => {
  let component: ProcessHeaderDropdownComponent;
  let fixture: ComponentFixture<ProcessHeaderDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessHeaderDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessHeaderDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
