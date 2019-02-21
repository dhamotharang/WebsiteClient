import {BranchItem} from '../model/branch-item.model';
import {BranchTranslation} from '../model/branch-translation.model';

export class BranchDetailViewModel {
    id: string;
    workTime: string;
    link: string;
    order: number;
    website: string;
    logo: string;
    isOffice: boolean;
    concurrencyStamp: string;
    branchContactDetails: BranchItem[];
    branchContactTranslations: BranchTranslation[];
}
