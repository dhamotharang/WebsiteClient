export class Language {
    id: string;
    languageId: string;
    isActive: boolean;
    isDefault: boolean;
    name: string;

    constructor(languageId?: string, isActive?: boolean, isDefault?: boolean, name?: string) {
        this.languageId = languageId;
        this.isActive = isActive;
        this.isDefault = isDefault;
        this.name = name;
    }
}
