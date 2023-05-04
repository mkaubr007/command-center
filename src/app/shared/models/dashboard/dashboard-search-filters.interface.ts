import { IDistinctName } from "../util/i-distinct-name.interface";

export interface IDashboardSearchFilters {
    clients?: string[] | string | IDistinctName;
    environments?: string[] | string; 
    services?: string[] | string;
    csrId?: string;
    clientNames?: string[];
}