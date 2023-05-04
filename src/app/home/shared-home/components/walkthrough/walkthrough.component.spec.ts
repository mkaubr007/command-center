import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WalkthroughComponent } from './walkthrough.component';

describe('WalkthroughComponent', () => {
  let component: WalkthroughComponent;
  let fixture: ComponentFixture<WalkthroughComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalkthroughComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkthroughComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit hide value', () => {
    jest.spyOn(component.hide, 'emit');

    component.closeWalkthrough();

    expect(component.hide.emit).toHaveBeenCalledWith(false);
  });
});
