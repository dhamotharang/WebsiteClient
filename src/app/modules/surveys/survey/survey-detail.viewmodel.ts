import { SurveyTranslation } from './survey-translation.model';
import { NhUserPicker } from '../../../shareds/components/nh-user-picker/nh-user-picker.model';

export interface SurveyDetailViewModel {
    id: string;
    surveyGroupId?: number;
    isActive: boolean;
    isRequire: boolean;
    isPreRendering: boolean;
    totalQuestion: number;
    limitedTimes: number;
    limitedTime: number;
    concurrencyStamp: string;
    startDate: string;
    endDate: string;
    surveyTranslations: SurveyTranslation[];
    questions: SurveyQuestionViewModel[];
    questionGroups: SurveyQuestionGroupViewModel[];
    users: NhUserPicker[];
}

export interface SurveyQuestionViewModel {
    id: string;
    name: string;
}

export interface SurveyQuestionGroupViewModel {
    id: string;
    name: string;
    totalQuestion: number;
}

export interface SurveyDetailResultViewModel {
    id: string;
    surveyGroupId?: number;
    isActive: boolean;
    isRequire: boolean;
    isPreRendering: boolean;
    totalQuestion: number;
    limitedTimes: number;
    limitedTime: number;
    concurrencyStamp: string;
    startDate: string;
    endDate: string;
    surveyTranslations: SurveyTranslation[];
    questions: SurveyQuestionResultViewModel[];
    questionGroups: SurveyQuestionGroupResultViewModel[];
    users: SurveyUserResultViewModel[];
}

export interface SurveyQuestionResultViewModel {
    questionVersionId: string;
    questionName: string;
}

export interface SurveyQuestionGroupResultViewModel {
    questionGroupId: string;
    questionGroupName: string;
    totalQuestion: number;
}

export interface SurveyUserResultViewModel {
    userId: string;
    fullName: string;
    avatar: string;
    officeName: string;
    positionName: string;
}

