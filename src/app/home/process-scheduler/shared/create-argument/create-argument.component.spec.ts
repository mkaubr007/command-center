import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateArgumentComponent } from './create-argument.component';

describe('CreateArgumentComponent', () => {
  let component: CreateArgumentComponent;
  let fixture: ComponentFixture<CreateArgumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateArgumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateArgumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
