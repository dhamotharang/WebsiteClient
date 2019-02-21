import {BranchTranslation} from './branch-translation.model';
import {BranchItem} from './branch-item.model';

export class Branch {
    workTime: string;
    googleMap: string;
    website: string;
    logo: string;
    isOffice: boolean;
    concurrencyStamp: string;
    branchItems: BranchItem[];
    modelTranslations: BranchTranslation[];

    constructor(workTime?: string, googleMap?: string, website?: string, logo?: string, isOffice?: boolean, concurrencyStamp?: string) {
        this.workTime = workTime;
        this.googleMap = googleMap;
        this.website = website;
        this.logo = logo;
        this.isOffice = false;
        this.modelTranslations = [];
        this.concurrencyStamp = this.concurrencyStamp;
    }
}
