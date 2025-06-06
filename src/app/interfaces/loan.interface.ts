import { Member } from "./member.interface";
import { ScheduleEntry } from "./schedule-entry.interface";

export interface Loan {
    id: number;
    member: Member;
    issuedDate: Date;
    principalAmount: number;
    monthlyInterestAmt: number;
    balanceRemaining: number;
    status: string; // 'OPEN', 'CLOSED'
    scheduleEntries: ScheduleEntry[];
}