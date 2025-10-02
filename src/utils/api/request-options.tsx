import { UserSecurityCredentials } from "../../section/model/user-security-credentials";
import { COMPAGO_USER_SECURITY_CREDENTIALS } from "../constant";

export enum HttpMethod {
    GET,
    POST,
    PUT,
    DELETE
}

export const requestOptions = (
    httpMethod: HttpMethod, 
    content?: unknown | undefined
) => {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');

    let userSecurityCredentials: UserSecurityCredentials | null = JSON.parse(localStorage.getItem(COMPAGO_USER_SECURITY_CREDENTIALS)!);
    requestHeaders.set('username', userSecurityCredentials?.username ?? "");
    requestHeaders.set('password', userSecurityCredentials?.password ?? "");

    return {
        method: HttpMethod[httpMethod],
        headers: requestHeaders,
        body: content !== undefined ? JSON.stringify(content) : undefined
    }
}