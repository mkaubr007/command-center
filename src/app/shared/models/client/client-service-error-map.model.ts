export class ClientServiceErrorMap {
    clientName: string;
    serviceName: string;
    environmentName: string;
    serviceCheckInStatus: string;
    serviceLastUpdatedOn: string;
    checkInStatusOrder:number;

    constructor(data?: ClientServiceErrorMap) {
      if (data) {
        for (const key in data) {
          this[key] = data[key];
        }
      }
    }
}