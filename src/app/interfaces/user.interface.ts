export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    phone: string;
    address: string;
    password: string;
    username: string;
    isActive: boolean;
    isExpired: boolean;
    isLocked: boolean;
}