export const TagType = {
    new: 0,
    product: 1,
    video: 2
};

export class Tag {
    id: string;
    tenantId: string;
    languageId: string;
    name: string;
    type: number;
    seoLink: string;
    constructor(id?: string, tenantId?: string, languageId?: string, name?: string, type?: number, seoLink?: string) {
      this.id = id;
      this.tenantId = tenantId;
      this.languageId = languageId;
      this.name = name;
      this.seoLink = seoLink;
    }
}
