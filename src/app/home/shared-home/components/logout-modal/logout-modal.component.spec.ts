import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { LogoutModalComponent } from './logout-modal.component';

const dialogMock = { close: (value = '') => {} };
describe('LogoutModalComponent', () => {
  let component: LogoutModalComponent;
  let fixture: ComponentFixture<LogoutModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LogoutModalComponent],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
    })
      .overrideTemplate(LogoutModalComponent, '<div></div>')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should close popup', () => {
    const dailogSpy = jest.spyOn(component.dialogRef, 'close');
    component.closePopup();
    expect(dailogSpy).toHaveBeenCalled();
  });
  
  it('should close popup with true', () => {
    const dailogSpy = jest.spyOn(component.dialogRef, 'close');
    component.closePopup(true);
    expect(dailogSpy).toHaveBeenCalledWith(true);
  });
});
