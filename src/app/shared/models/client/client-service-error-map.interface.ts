export interface IClientServiceErrorMap {
    clientName: string;
    serviceName: string;
    environmentName: string;
    serviceCheckInStatus: string;
    serviceLastUpdatedOn: string;
    checkInStatusOrder:number;
    errorCount?: number;
}