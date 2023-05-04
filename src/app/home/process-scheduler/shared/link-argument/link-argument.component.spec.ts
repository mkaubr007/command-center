import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkArgumentComponent } from './link-argument.component';

describe('LinkArgumentComponent', () => {
  let component: LinkArgumentComponent;
  let fixture: ComponentFixture<LinkArgumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkArgumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkArgumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
