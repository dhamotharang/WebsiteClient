import {UserContact} from './user-contact.model';
import {UserTranslation} from './user-translation.model';

export const UserStatus = {
    // Dịch vụ
    collaborators: 0,
    // Học việc
    apprentice: 1,
    // Thử việc
    probation: 2,
    // chính thức.
    official: 3,
    // Thai sản.
    maternity: 4,
    // Thôi việc.
    discontinue: 5,
    // Nghỉ hửu
    retirement: 6
};

export const UserType = {
    // Nhân viên.
    staff: 0,
    // Trưởng đơn vị.
    leader: 1,
    // Phó đơn vị.
    viceLeader: 2
};

export const AcademicRank = {
    // Thạc Sỹ
    master: 0,
    // Tiến sỹ
    phD: 1,
    // Giáo sư
    professor: 2
};

export const MarriedStatus = {
    // Độc thân
    single: 0,
    // Kết hôn
    married: 1,
    // Ly thân
    separated: 2,
    // Ly hôn
    divorce: 3,
};

export const Gender = {
    // Nam
    male: 1,
    // Nữ.
    female: 0,
    // Khác.
    other: 2
};

export class User {
    id: string;
    fullName: string;
    userName: string;
    avatar: string;
    birthday: Date;
    idCardNumber: string;
    idCardDateOfIssue?: Date;
    gender: number;
    ethnic?: number;
    denomination?: number;
    tin: string;
    joinedDate: Date;
    bankingNumber: string;
    nationalId: number;
    provinceId: number;
    districtId: number;
    marriedStatus?: number;
    officeId: number;
    titleId: string;
    positionId: string;
    userType: number;
    passportId: string;
    passportDateOfIssue: Date;
    enrollNumber?: number;
    cardNumber: string;
    ext: string;
    concurrencyStamp: string;
    academicRank?: number;
    modelTranslations: UserTranslation[];
    userContacts: UserContact[];

    constructor() {
        this.userType = UserType.staff;
    }
}
