import { RolePageViewModel } from './role-page.viewmodel';
import { NhUserPicker } from '../../../../shareds/components/nh-user-picker/nh-user-picker.model';

export interface RoleDetailViewModel {
    id: string;
    name: string;
    description: string;
    concurrencyStamp: string;
    rolePages?: RolePageViewModel[];
    users?: NhUserPicker[];
}
