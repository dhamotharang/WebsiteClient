export class Account {
    userName: string;
    fullName: string;
    password: string;
    confirmPassword: string;
    email: string;
    phoneNumber: string;
    isActive: boolean;
    concurrencyStamp: string;

    constructor(userName?: string, fullName?: string, email?: string, phoneNumber?: string,
                isActive?: boolean, concurrencyStamp?: string) {
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.isActive = isActive != null && isActive !== undefined ? isActive : true;
        this.concurrencyStamp = concurrencyStamp;
    }
}
