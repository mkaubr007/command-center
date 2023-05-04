import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CustomHttpService } from '../../core/services/http.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { CacheService } from '../../home/cache-service';
import { SocketService } from '../../home/shared-home/services/socket/socket.service';
import { SharedHomeModule } from '../../home/shared-home/shared-home.module';
import { WebSocketService } from '../../services/web-socket/web-socket.service';
import { AuthService } from '../auth.service';
import { JiraLoginComponent } from './jiralogin.component';

class MockAuthService extends AuthService {
  createIssues(): any {
    return of({ message: 'Success' });
  }
}

class MockCacheService {}

class MockSocketService {}

class MockWebSocketService {}

describe('JiraloginComponent', () => {
  let component: JiraLoginComponent;
  let fixture: ComponentFixture<JiraLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedHomeModule,
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [
        JiraLoginComponent
      ],
      providers: [
        LocalStorageService,
        { provide: AuthService, useClass: MockAuthService },
        { provide: CacheService, useClass: MockCacheService },
        { provide: SocketService, useClass: MockSocketService },
        { provide: WebSocketService, useClass: MockWebSocketService },
        CustomHttpService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JiraLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should init component', () => {
    expect(component).toBeTruthy();
  });

  it('should create jira ticket', () => {
    const createIssuesSpy = jest.spyOn(component['_authService'], 'createIssues');
    component.createIssues();
    expect(createIssuesSpy).toHaveBeenCalled();
  })
});
