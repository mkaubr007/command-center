export class ProcessArgumentsResponse {
    data: ProcessArgumentsParams;
    message: string;
    statusCode: number;
}

export class ProcessArgumentsParams {
    count: number;
    result: ProcessArgument[];
  
    constructor(data?: ProcessArgumentsParams) {
      if (data) {
        for (const key in data) {
          this[key] = data[key];
        }
      }
    }
  }

export class ProcessArgument {
    _id?: string;
    order: number;
    selected: boolean;
    name: string;
    namespace: string;
    argumentType: string;
    value: string;
    arguments?: ProcessArgument[];
    environment: string;
    isDeleted: boolean;
    isPublished: boolean;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;

    constructor(data?: ProcessArgument) {
    if (data) {
        for (const key in data) {
        this[key] = data[key];
        }
    }
    }
}