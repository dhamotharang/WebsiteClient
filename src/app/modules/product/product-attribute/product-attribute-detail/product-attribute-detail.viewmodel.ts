export interface ProductAttributeDetailViewModel {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    isMultiple: boolean;
    isRequire: boolean;
    isSelfContent: boolean;
}

export interface ProductAttributeValueViewModel {
    id: string;
    description: string;
    isActive: boolean;
}
