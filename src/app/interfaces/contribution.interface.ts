import { Member } from "./member.interface";

export interface Contribution {
    id: number;
    member: Member
    date: Date;
    amount: number;
    memberName: String;
    memberId: number;
}