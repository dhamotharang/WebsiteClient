export class Agency {
    email: string;
    phoneNumber: string;
    website: string;
    idCard: string;
    idCardDate: Date;
    provinceId: number;
    districtId: number;
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
    translations: AgencyTransaction[];

    constructor() {
        this.email = '';
        this.phoneNumber = '';
        this.website = '';
        this.idCard = '';
        this.idCardDate = null;
        this.provinceId = 0;
        this.districtId = 0;
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
