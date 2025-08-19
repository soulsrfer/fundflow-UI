import { Loan } from "./loan.interface";
import { Transaction } from "./transaction.interface";

export interface ScheduleEntry {
    id: number;
    loanId: number;
    periodNumber: number;
    dueDate: Date;
    dueAmount: number;
    amountPaid: number;
    status: string; // 'PENDING', 'PAID'
    penalty: number;
    loan: Loan;
    memberName: string;
    memberId: number;
}