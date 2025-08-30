import { ScheduleEntry } from "./schedule-entry.interface";

export interface Transaction {
    id: number;
    date: Date;
    amount: number;
    memberId: number;
    memberName?: string;
    type: string; // PRINCIPAL_PAYMENT, INTEREST_PAYMENT, CONTRIBUTION
    status: string;
    referenceId: string;
    paymentMethod: string; // CASH, CARD, BANK_TRANSFER, MOBILE_MONEY
    loanId?: number;
    contributionId?: number;
    scheduleEntryId: number;
    notes: string;
}