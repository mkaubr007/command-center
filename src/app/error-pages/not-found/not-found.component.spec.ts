import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundComponent } from './not-found.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  class RouterStub {
    navigate(url: string) {
      return url;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotFoundComponent ],
      imports: [
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
