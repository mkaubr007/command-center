import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { WebSocketService } from '../../../../services/web-socket/web-socket.service';
import { HomeDropdownConstants } from '../../components/home-dropdown/home-dropdown.constants';

import { SocketService } from './socket.service';

class WebSocketServiceSpy {
  disconnect() { }
  fromEvent(): Observable<any> {
    return of(true);
  }
  emit() { }
  connect() { }
}
describe('SocketService', () => {
  let service: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: WebSocketService, useClass: WebSocketServiceSpy }
      ]
    });
    service = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('shuld connect socket', () => {
    service['socket'].ioSocket = {
      isConnected : false
    };
    const connectSpy = jest.spyOn(service['socket'], 'connect');
    service.connectSocket('123');
    expect(connectSpy).toHaveBeenCalled();
  });

  it('should subscribe Socket Ping', async () => {
    const formEventSpy = jest.spyOn(service['socket'], 'fromEvent').mockImplementation();
    service.subscribeSocketPing();
    expect(formEventSpy).toHaveBeenCalledWith('ping');
  });

  it('should Deactivate Client', async () => {
    const formEventSpy = jest.spyOn(service['socket'], 'fromEvent').mockImplementation();
    service.onDeactivatedClient();
    expect(formEventSpy).toHaveBeenCalledWith('update:dashboardFilters');
  });

  it('should activate client', async () => {
    const formEventSpy = jest.spyOn(service['socket'], 'fromEvent').mockImplementation();
    service.activateClient();
    expect(formEventSpy).toHaveBeenCalledWith('update:getNewClientEnv');
  });

  it('should add new Connection', async () => {
    const formEventSpy = jest.spyOn(service['socket'], 'fromEvent').mockImplementation();
    service.newConnection();
    expect(formEventSpy).toHaveBeenCalledWith('new:conection');
  });

  it('should subscribe new notification', async () => {
    const formEventSpy = jest.spyOn(service['socket'], 'fromEvent').mockImplementation();
    service.subscribeNewNotification();
    expect(formEventSpy).toHaveBeenCalledWith('new:notification');
  });

  it('should disconnect socket', () => {
    const disconnectSpy = jest.spyOn(service['socket'], 'disconnect').mockImplementation();
    service.disconnectSocket();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should emit emitDeactivatedClient', () => {
    const emitSpy = jest.spyOn(service['socket'], 'emit').mockImplementation();
    service.emitDeactivatedClient('test');
    expect(emitSpy).toHaveBeenCalledWith('update:dashboardFilters', 'test');
  });

  it('should emit activatedClient', () => {
    const emitSpy = jest.spyOn(service['socket'], 'emit').mockImplementation();
    service.emitActivatedClient(HomeDropdownConstants.ACTIVATED_CLIENT);
    expect(emitSpy).toHaveBeenCalledWith('update:addClientEnv', HomeDropdownConstants.ACTIVATED_CLIENT);
  });

  it('should emit new Connection', () => {
    const emitSpy = jest.spyOn(service['socket'], 'emit').mockImplementation();
    service.addNewConnection('1');
    expect(emitSpy).toHaveBeenCalledWith('new:conection', '1');
  });

  it('should emit emitDeactivatedClient', () => {
    const emitSpy = jest.spyOn(service['socket'], 'emit').mockImplementation();
    service.emitDeactivatedTeamMember();
    expect(emitSpy).toHaveBeenCalledWith('update:assigneeList');
  });
});
