import { ScheduleEntry } from "./schedule-entry.interface";

export interface Transaction {
    id: number;
    scheduleEntry: ScheduleEntry;
    date: Date;
    amount: number;
    type: string; // PRINCIPAL_PAYMENT, INTEREST_PAYMENT, CONTRIBUTION
}