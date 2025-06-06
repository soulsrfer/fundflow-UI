import { Contribution } from "./contribution.interface";
import { Loan } from "./loan.interface";

export interface Member {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    joinedDate: Date;
    active: boolean;
    loans: Loan[];
    contributions: Contribution[];
}