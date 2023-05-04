import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkProcessComponent } from './link-process.component';

describe('LinkProcessComponent', () => {
  let component: LinkProcessComponent;
  let fixture: ComponentFixture<LinkProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
