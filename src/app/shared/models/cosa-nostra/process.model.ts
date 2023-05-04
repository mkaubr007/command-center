import { ProcessArgument } from "./process-arguments.model";

export class ProcessResponse {
    data: ProcessParams;
    message: string;
    statusCode: number;
}

export class ProcessParams {
    count: number;
    result: Processes[];

    constructor(data?: ProcessParams) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
}

export class ProcessListArgumentsValues {
    _id?: string
    overrideValue?: string
}

export class ProcessListArguments {
    overrideArgumentDefinition?: string
    overrideArgumentAssembly?: string
    argumentValues?: ProcessListArgumentsValues[]
    argumentValuesDetails?: ProcessArgument[]
}

export class Processes {
    _id?: string;
    selected: boolean;
    arguments?: ProcessListArguments
    dependencies: []
    isEnabled: boolean
    failureFatal: boolean
    nonFatalExceptions: []
    status: string
    isDeleted: boolean
    isPublished: boolean
    createdAt: Date
    name: string
    displayName: string
    assembly: string
    class: string
    runnerAssembly: string
    runner: string
    environment: string

    constructor(data?: Processes) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
}