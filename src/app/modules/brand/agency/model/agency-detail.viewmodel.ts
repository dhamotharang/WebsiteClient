import {AgencyTransaction} from './agency.model';

export class AgencyDetailViewModel {
    id: string;
    email: string;
    phoneNumber: string;
    website: string;
    idCard: string;
    idCardDate: string;
    nationalId: string;
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
}