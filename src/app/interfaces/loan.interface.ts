import { Member } from "./member.interface";
import { ScheduleEntry } from "./schedule-entry.interface";

export interface Loan {
    id: number;
    memberId: number;
    memberName: string;
    issuedDate: Date;
    endDate: Date;
    principalAmount: number;
    flatInterestRate: number;
    totalRepayment: number;
    emiAmount: number;
    numberOfInstallments: number;
    balanceRemaining: number;
    status: string; // 'OPEN', 'CLOSED'
    scheduleEntries: ScheduleEntry[];
    member: Member;
}