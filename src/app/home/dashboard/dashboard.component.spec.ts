import {
  ComponentFactory,ComponentRef,ElementRef, EmbeddedViewRef, Injector,
  NgModuleRef, Renderer2,RendererStyleFlags2,TemplateRef, ViewContainerRef,ViewRef
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../auth/auth.service';
import { MockAuthService } from '../../auth/mock-auth.service';
import { HomeService } from '../../home/home.service';
import { WalkthroughSix } from '../../shared/enums/walkthrough.enum';
import { PaginatorComponent } from '../shared-home/components/paginator/paginator.component';
import { DashboardComponent } from './dashboard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedService } from '../../shared/shared.service';
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: AuthService;
  let renderer: Renderer2;

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

  class MockSharedService {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DashboardComponent],
      providers: [
        { provide: AuthService, useclass: MockAuthService },
        { provide: Renderer2, useclass: RendererTest },
        { provide: SharedService, useClass: MockSharedService },
        HomeService,
      ],
    })
      .overrideTemplate(DashboardComponent, '<div></div>')
      // .overrideComponent(DashboardComponent, {
      //   set: { changeDetection: ChangeDetectionStrategy.Default },
      // })
      .compileComponents();
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.debugElement.componentInstance;
    authService = TestBed.inject(AuthService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should set walkthrough Data to last walkthrough', () => {
    component.walkthroughdata = null;
    jest.spyOn(authService, 'loginUser').mockImplementation();

    component.setWalkthroughData();

    expect(component.walkthroughdata).toEqual(WalkthroughSix);
  });

  xit('should close when clicked outside', () => {
    const directive = new PaginatorComponent(
      new RendererTest(),
      new TestViewContainerRef()
    );
    expect(directive).toBeTruthy();
    const listenSpy = jest.spyOn(renderer, 'listen');

    component.closeWalkthroughWhenClickedOutside();

    expect(listenSpy).toHaveBeenCalled();
  });
});
