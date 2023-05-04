const moment = require('moment').default || require('moment');
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatepickerComponent } from './datepicker.component';
describe('DatepickerComponent', () => {
    let component: DatepickerComponent;
    let fixture: ComponentFixture<DatepickerComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [
                DatepickerComponent,
            ]
        }).overrideTemplate(DatepickerComponent, '<div><div #DaterangepickerDirective></div></div>').compileComponents();

        fixture = TestBed.createComponent(DatepickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('dateRangeChange', () => {
        
        jest.spyOn(component.updateDateRange, 'emit');

        component.dateRangeChange();

        expect(component.updateDateRange.emit).toHaveBeenCalled()
    });
});
