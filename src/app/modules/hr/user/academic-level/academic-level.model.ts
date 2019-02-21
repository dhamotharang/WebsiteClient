export class AcademicLevel {
    id: number;
    academicLevelId: number;
    academicLevelName: string;
    degreeId: number;
    degreeName: string;
    schoolId: number;
    schoolName: string;
    specializeId: number;
    specializeName: string;
    userId: string;
    note: string;

    constructor(id?: number, academicLevelId?: number, academicLevelName?: string, degreeId?: number, degreeName?: string, schoolId?: number, schoolName?: string,
        specializeId?: number, specializeName?: string, userId?: string, note?: string) {
        this.id = id ? id : -1;
        this.academicLevelId = academicLevelId;
        this.academicLevelName = academicLevelName;
        this.degreeId = degreeId;
        this.degreeName = degreeName;
        this.schoolId = schoolId;
        this.schoolName = schoolName;
        this.specializeId = specializeId;
        this.specializeName = specializeName;
        this.userId = userId;
        this.note = note;
    }
}
