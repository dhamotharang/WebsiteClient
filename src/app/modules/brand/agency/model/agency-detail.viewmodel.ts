import {AgencyTransaction} from './agency.model';

export class AgencyDetailViewModel {
    id: string;
    email: string;
    phoneNumber: string;
    website: string;
    idCard: string;
    idCardDate: string;
    nationalId: string;
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
}