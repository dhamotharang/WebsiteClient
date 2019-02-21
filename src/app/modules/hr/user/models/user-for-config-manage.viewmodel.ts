import {UserSuggestion} from '../../../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.component';

export class UserForConfigManageViewModel {
    userId: string;
    fullName: string;
    avatar: string;
    positionName: string;
    positionId: string;
    managerId: string;
    managerName: string;
    approveId: string;
    approveName: string;
    isSelect: boolean;
    managerUserSelect:  UserSuggestion;
    approveUserSelect: UserSuggestion;

    constructor() {
        this.managerUserSelect = new UserSuggestion();
        this.approveUserSelect = new UserSuggestion();
    }
}
