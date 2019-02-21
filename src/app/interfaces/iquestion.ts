import { IAnswer } from "./ianswer";
/**
 * Created by HoangNH on 5/21/2017.
 */
export interface IQuestion {
    id: number;
    name: string;
    type: number;
    order: number;
    isRequire?: boolean;
    listAnswer?: IAnswer[];
}
