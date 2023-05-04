import { of } from "rxjs";

export class MockSocketService {
    emitDeactivatedTeamMember() { }

    onDeactivatedClient() { return of() }

    activateClient() { return of() }
    
    emitCSRUpdate() { }
    
    subscribeCSRUpdate() { return of() }
}