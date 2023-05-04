import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketService } from '../../../../services/web-socket/web-socket.service';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: WebSocketService) {}

  public connectSocket(userId: string): void {
    if (!this.socket.ioSocket.connected) {
      this.socket.connect();
    } else {
      this.addNewConnection(userId);
    }
  }

  public subscribeSocketPing(): Observable<any> {
    return this.socket.fromEvent<any>('ping');
  }

  public addNewConnection(userId: string): void {
    this.socket.emit('new:conection', userId);
  }
  public onDeactivatedClient(): Observable<any> {
    return this.socket.fromEvent<any>('update:dashboardFilters');
  }

  public activateClient(): Observable<any> {
    return this.socket.fromEvent<any>('update:getNewClientEnv');
  }

  public onDeactivateTeamMember(): Observable<any> {
    return this.socket.fromEvent<any>('get:assigneeList');
  }

  public newConnection(): Observable<any> {
    return this.socket.fromEvent<any>('new:conection');
  }

  public subscribeNewNotification(): Observable<any> {
    return this.socket.fromEvent<any>('new:notification');
  }

  public disconnectSocket(): void {
    this.socket.disconnect();
  }

  public emitDeactivatedClient(deactivatedClient: any): void {
    this.socket.emit('update:dashboardFilters', deactivatedClient);
  }

  public emitActivatedClient(activatedClient: any): void {
    this.socket.emit('update:addClientEnv', activatedClient);
  }
  public emitDeactivatedTeamMember(): void {
    this.socket.emit('update:assigneeList');
  }

  public emitCSRUpdate(csrId: string): void {
    this.socket.emit('update:CSR', csrId);
  }

  public subscribeCSRUpdate(): Observable<any> {
    return this.socket.fromEvent<any>('update:CSR');
  }
}
