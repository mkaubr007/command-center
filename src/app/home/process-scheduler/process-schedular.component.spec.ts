import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessSchedularComponent } from './process-schedular.component';

describe('ProcessSchedularComponent', () => {
  let component: ProcessSchedularComponent;
  let fixture: ComponentFixture<ProcessSchedularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessSchedularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessSchedularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
