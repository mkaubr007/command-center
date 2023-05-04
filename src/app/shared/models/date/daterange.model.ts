export class Daterange {
    startDate: any;
    endDate: any;

    constructor(data?: Daterange) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
}