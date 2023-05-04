import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../../../environments/environment';

@Injectable()
export class WebSocketService extends Socket {
    constructor() {
        let host = environment.backendBasedUrl;
        console.log(`host: ${host}`);
        const config: SocketIoConfig = {
            url: host,
            options: {
                transports: ['websocket']
            }
        };
        super(config);
    }
}
