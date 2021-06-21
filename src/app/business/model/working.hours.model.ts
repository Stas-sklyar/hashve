export class StoreTime{
    public hour: number;
    public minute: number;

    public constructor(hour: number = 0, minute: number = 0){
        this.hour = hour;
        this.minute = minute;
    }
}

export class WorkingHours{
    public active: boolean;
    public open: StoreTime;
    public close: StoreTime;

    public constructor(active: boolean, open: StoreTime = new StoreTime(), close: StoreTime = new StoreTime()){
        this.active = active;
        this.open = open;
        this.close = close;
    }
}
