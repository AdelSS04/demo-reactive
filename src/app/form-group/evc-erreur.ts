export type EvcError = {
    message:string;
}
export type EvcErrorsAvecCle = Prettify<EvcError & {cleErreur:string}>

type Prettify<T> = {
    [K in keyof T]: T[K];
  } & {};

export type EvcApiErrors = {
    message:string;
    code: string;
    propertyName: string;
}
