import { Loan } from "./loan.interface";
import { Transaction } from "./transaction.interface";

export interface ScheduleEntry {
    id: number;
    loan: Loan;
    periodNumber: number;
    dueDate: Date;
    expectedInterest: number;
    expectedPrincipal: number;
    status: string; // 'PENDING', 'PAID'
    transactions: Transaction[]; // Array of transactions associated with this schedule entry
}