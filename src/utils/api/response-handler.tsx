import { 
    COMPAGO_USER_SECURITY_CREDENTIALS, 
    COMPAGO_LOGOUT_INFO, 
    COMPAGO_PAGE_LOGOUT_RELOAD } from "../constant";
import { LOGIN } from "../../infrastructure/route";
import { dateTimeReviver } from "../helper/json-helper";
import { ApiError } from "./api-error";
import { ApiErrorResponse } from "./api-error-response";

export function handleResponse<TResponse>(response: Response) {
    if (!response.ok) {
        return handleFailedResponse(response);
    } else {
        return response.text().then((json) => {
            if (json !== '') {
                return JSON.parse(json, dateTimeReviver);
            }
        }) as TResponse
    }
}

export function handleResponseNoContent(response: Response) {
    if (!response.ok) {
        return handleFailedResponse(response);
    }
}

async function handleFailedResponse(response: Response) {
    var error = await response.json();
    if (response.status === 401) {
        if (window.location.pathname !== LOGIN) {
            sessionStorage.setItem(COMPAGO_LOGOUT_INFO, "You have been logged out, please login again");
            sessionStorage.setItem(COMPAGO_PAGE_LOGOUT_RELOAD, 'true');
            //window.location.href = LOGIN;
        }
        localStorage.removeItem(COMPAGO_USER_SECURITY_CREDENTIALS);
        throw new ApiError({ errorCode: 401, errorDescription: "Unauthorized", errorType: error.ErrorType });
    } else if (response.status === 400) {
        throw new ApiError({ errorCode: 400, errorDescription: "Bad request", errorType: error.ErrorType });
    } else if (response.status === 403) {
        throw new ApiError({ errorCode: 403, errorDescription: "Forbidden", errorType: error.ErrorType });
    } else if (response.status === 404) {
        throw new ApiError({ errorCode: 404, errorDescription: "Not found", errorType: error.ErrorType });
    } else if (response.status === 409) {
        throw new ApiError({ errorCode: 409, errorDescription: "Conflict", errorType: error.ErrorType });
    } else {
        return (response.json() as Promise<ApiErrorResponse>).then(result => {
            throw new ApiError(result);
        })
    }
}