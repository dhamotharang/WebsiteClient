export class Agency {
    email: string;
    phoneNumber: string;
    website: string;
    idCard: string;
    idCardDate: string;
    provinceId: string;
    districtId: string;
    length: number;
    width: number;
    height: number;
    totalArea: number;
    startTime: Date;
    googleMap: string;
    order: number;
    isShow: boolean;
    isActive: boolean;
    provinceName: string;
    districtName: string;
    concurrencyStamp: string;
    transactions: AgencyTransaction[];

    constructor() {
        this.email = '';
        this.phoneNumber = '';
        this.website = '';
        this.idCard = '';
        this.idCardDate = null;
        this.provinceId = '';
        this.districtId = '';
        this.length = 0;
        this.width = 0;
        this.height = 0;
        this.totalArea = 0;
        this.startTime = new Date();
        this.googleMap = '';
        this.order = 0;
        this.isShow = true;
        this.isActive = true;
        this.concurrencyStamp = '';
    }
}

export class AgencyTransaction {
    languageId: string;
    fullName: string;
    agencyName: string;
    idCardAddress: string;
    address: string;
    addressRegistered: string;
}
