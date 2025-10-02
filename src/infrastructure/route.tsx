export const PARAMETER_TAG_ID = ":tagId";
export const PARAMETER_USER_ID = ":userId";
export const PARAMETER_INVOICE_ID = ":userId";

export const HOME: string = "/";
export const LOGIN: string = "/login";
export const NO_ACCESS: string = "/no-access";

export const TAG_MANAGEMENT_LIST: string = `/tag`;
export const TAG_MANAGEMENT_ADD: string = `/tag/add`;
export const TAG_MANAGEMENT_EDIT: string = `/tag/${PARAMETER_TAG_ID}`;
export const USER_MANAGEMENT_LIST: string = `/user`;
export const USER_MANAGEMENT_ADD: string = `/user/add`;
export const USER_MANAGEMENT_EDIT: string = `/user/${PARAMETER_USER_ID}`;
export const INVOICE_MANAGEMENT_EDIT: string = `/invoice/${PARAMETER_INVOICE_ID}`;
export const INVOICE_MANAGEMENT_LIST: string = `/invoice`;