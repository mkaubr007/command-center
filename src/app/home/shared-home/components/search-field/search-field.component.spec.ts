import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFieldComponent } from './search-field.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';
import { SearchFieldConstants } from './search-field.constants';

describe('SearchFieldComponent', () => {
  let component: SearchFieldComponent;
  let fixture: ComponentFixture<SearchFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFieldComponent ],
      imports: [
        MaterialModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFieldComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check key press event', ()=> {
    component.searchValue = '';
    const result = component.onKeyPress(SearchFieldConstants.KEYPRESS_EVENT as KeyboardEvent);

    expect(result).toBeFalsy();
  });

  it('should check paste event', ()=> {
    const result = component.onPaste(SearchFieldConstants.PASTED_EVENT as ClipboardEvent);

    expect(result).toBeFalsy();
  });
});
