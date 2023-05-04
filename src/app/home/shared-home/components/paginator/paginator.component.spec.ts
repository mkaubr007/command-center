import {
  ComponentFactory,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  Injector,
  NgModuleRef,
  Renderer2,
  RendererStyleFlags2,
  TemplateRef,
  ViewContainerRef,
  ViewRef
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginatorConstant } from './paginator.constant';
import { MaterialModule } from '../../../../material/material.module';
import { ManageTeam } from '../../../team/shared/components/manage-teams/test.constants';
import { InputFieldComponent } from '../input-field/input-field.component';
import { PaginatorComponent } from './paginator.component';
import { SelectBoxComponent } from '../select-box/select-box.component';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  class TestViewContainerRef extends ViewContainerRef {
    clear(): void {}
    createComponent<C>(
      componentFactory: ComponentFactory<C>,
      index?: number,
      injector?: Injector,
      projectableNodes?: any[][],
      ngModule?: NgModuleRef<any>
    ): ComponentRef<C> {
      return undefined;
    }

    createEmbeddedView<C>(
      templateRef: TemplateRef<C>,
      context?: C,
      index?: number
    ): EmbeddedViewRef<C> {
      return undefined;
    }

    detach(index?: number): ViewRef | null {
      return undefined;
    }

    get element(): ElementRef<any> {
      return undefined;
    }

    get(index: number): ViewRef | null {
      return undefined;
    }

    indexOf(viewRef: ViewRef): number {
      return 0;
    }

    get injector(): Injector {
      return undefined;
    }

    insert(viewRef: ViewRef, index?: number): ViewRef {
      return undefined;
    }

    get length(): number {
      return 0;
    }

    move(viewRef: ViewRef, currentIndex: number): ViewRef {
      return undefined;
    }

    get parentInjector(): Injector {
      return undefined;
    }

    remove(index?: number): void {}
  }

  class RendererTest extends Renderer2 {
    addClass(el: any, name: string): void {}

    appendChild(parent: any, newChild: any): void {}

    createComment(value: string): any {}

    createElement(name: string, namespace?: string | null): any {}

    createText(value: string): any {}

    get data(): { [p: string]: any } {
      return {};
    }

    destroy(): void {}

    insertBefore(parent: any, newChild: any, refChild: any): void {}

    listen(
      target: 'window' | 'document' | 'body' | any,
      eventName: string,
      callback: (event: any) => boolean | void
    ): () => void {
      return function () {};
    }

    nextSibling(node: any): any {}

    parentNode(node: any): any {}

    removeAttribute(el: any, name: string, namespace?: string | null): void {}

    removeChild(parent: any, oldChild: any, isHostElement?: boolean): void {}

    removeClass(el: any, name: string): void {}

    removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void {}

    selectRootElement(
      selectorOrNode: string | any,
      preserveContent?: boolean
    ): any {}

    setAttribute(
      el: any,
      name: string,
      value: string,
      namespace?: string | null
    ): void {}

    setProperty(el: any, name: string, value: any): void {}

    setStyle(
      el: any,
      style: string,
      value: any,
      flags?: RendererStyleFlags2
    ): void {}

    setValue(node: any, value: string): void {}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaginatorComponent, InputFieldComponent, SelectBoxComponent],
      imports: [MaterialModule, FormsModule, BrowserAnimationsModule],
      providers: [MatPaginator],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should set page', () => {
    spyOn(component.page, 'emit');
    fixture.detectChanges();
    component.manualPage = ManageTeam.PAGINATOR.pageIndex + 1;
    component.setPage(ManageTeam.PAGINATOR);
    expect(component.page.emit).toHaveBeenCalledWith(ManageTeam.PAGINATOR);
  });

  it('should create html paginator', () => {
    const directive = new PaginatorComponent(
      new RendererTest(),
      new TestViewContainerRef()
    );
    expect(directive).toBeTruthy();
    const addClass = jest.spyOn(component['renderer'], 'addClass');
    const createElement = jest.spyOn(component['renderer'], 'createElement');
    const createText = jest.spyOn(component['renderer'], 'createText');
    const appendChild = jest.spyOn(component['renderer'], 'appendChild');

    component.createPaginatorHTML();

    expect(addClass).toHaveBeenCalled();
    expect(createElement).toHaveBeenCalled();
    expect(createText).toHaveBeenCalled();
    expect(appendChild).toHaveBeenCalled();
  });

  it('should update page manually', () => {
    jest.spyOn(component, 'updateManualPage');
    jest.spyOn(component['page'], 'emit');

    const event = {
      pageIndex: 1,
    };

    component.paginator = TestBed.createComponent(MatPaginator).componentInstance;
    component.updateManualPage(2);

    expect(component.updateManualPage).toHaveBeenCalledWith(2);
    expect(component.paginator.pageIndex).toEqual(1);
    expect(component['page'].emit).toHaveBeenCalledWith(event);
  });

  it('should return only digits and enter', () => {
    component.pageSize = 1;
    let result = component.onlyDigitAndEnter(PaginatorConstant.KEYPRESS_EVENT as KeyboardEvent);

    expect(result).toBeTruthy();

    result = component.onlyDigitAndEnter(PaginatorConstant.KEYPRESS_EVENT_ENTER as KeyboardEvent);

    expect(result).toBeTruthy();

    result = component.onlyDigitAndEnter(PaginatorConstant.KEYPRESS_EVENT_NON_NUMERIC as KeyboardEvent);

    expect(result).toBeFalsy();
  });

  it('should not update page size if page size greater than total errors', () => {
    const setGotoSpy = jest.spyOn(component, 'setGoto').mockImplementation();
    component.length = 5;
    component.pageSize = 2;

    component.updatePageSize(6);

    expect(component.pageSize).toBe(2);
    expect(component.newPageSize).toBe(2);

    expect(setGotoSpy).toHaveBeenCalled();
  });

  it('should set page size to page length if provided page size greater than page length', () => {
    const setGotoSpy = jest.spyOn(component, 'setGoto').mockImplementation();
    component.length = 5;
    component.pageSize = 6;

    component.updatePageSize(1);

    expect(component.pageSize).toBe(5);
    expect(component.newPageSize).toBe(5);

    expect(setGotoSpy).toHaveBeenCalled();
  });

  it('should update page size if no index provide only for enter and focusout', () => {
    const changedPageSizeSpy = jest.spyOn(component.changedPageSize, 'emit').mockImplementation();
    component.length = 5;
    component.pageSize = 2;

    component.updatePageSize(null, PaginatorConstant.KEYPRESS_EVENT_NON_NUMERIC as KeyboardEvent);

    expect(changedPageSizeSpy).toHaveBeenCalledTimes(0);

    component.updatePageSize(null, PaginatorConstant.KEYPRESS_EVENT_ENTER as KeyboardEvent);

    expect(component.newPageSize).toBe(2);

    expect(changedPageSizeSpy).toHaveBeenCalled();
  });

  it('should not emit update page event on entering the same page size', () => {
    const changedPageSizeSpy = jest.spyOn(component.changedPageSize, 'emit').mockImplementation();
    component.newPageSize = 2;
    component.pageSize = 2;

    component.updatePageSize(null, PaginatorConstant.KEYPRESS_EVENT_ENTER as KeyboardEvent);

    expect(changedPageSizeSpy).toHaveBeenCalledTimes(0);
  });

  it('should validate pasted text', () => {
    const result = component.onPaste(PaginatorConstant.PASTED_EVENT as ClipboardEvent);

    expect(result).toBeTruthy();
  });
});
