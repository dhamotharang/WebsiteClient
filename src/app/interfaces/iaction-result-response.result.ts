/**
 * @deprecated This interface will be replace in next version. Please use ActionResultViewModel instead.
 */
export interface IActionResultResponse<T = null> {
    code: number;
    message: string;
    title?: string;
    data?: T;
}

// export interface ActionResultResponse<T> {
//     code: number;
//     message: string;
//     title?: string;
//     data?: T;
// }

