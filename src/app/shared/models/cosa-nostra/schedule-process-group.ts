export class ScheduleProcessGroupResponse {
    data: ScheduleProcessGroup;
    message: string;
    statusCode: number;
}

export class ScheduleProcessGroup {
    _id?: string;
    scheduleDefinitionId: string;
    client: string;
    environment: string;
    schedule: Schedule[]

    constructor(data?: ScheduleProcessGroup) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
}

export class Schedule {
    _id?: string;
    processGroupId: string;
    cronExpression: string;
    isEnabled: boolean;
    scheduleType: string;
    interval?: string;
    nextScheduledDate?: string;
    processGroupName?: string;
    nextScheduled?: string;

    constructor(data?: Schedule) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
}

export interface IScheduleProcessGroupResponse {
    count: number;
    result: ScheduleProcessGroup;
}

export class ScheduleExtended extends  Schedule{
    client: string;
    environment: string;
}