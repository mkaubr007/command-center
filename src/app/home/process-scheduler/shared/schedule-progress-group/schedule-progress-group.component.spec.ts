import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleProgressGroupComponent } from './schedule-progress-group.component';

describe('ScheduleProgressGroupComponent', () => {
  let component: ScheduleProgressGroupComponent;
  let fixture: ComponentFixture<ScheduleProgressGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleProgressGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleProgressGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
