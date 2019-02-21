import { NhUserPicker } from '../../../../shareds/components/nh-user-picker/nh-user-picker.model';

export class Role {
    id: string;
    name: string;
    description: string;
    type: number;
    concurrencyStamp: string;
    rolesPagesViewModels?: RolesPagesViewModels[];
    users: NhUserPicker[];
}

export interface RolesPagesViewModels {
    pageId: number;
    pageName: string;
    idPath: string;
    permissions: number;
}
