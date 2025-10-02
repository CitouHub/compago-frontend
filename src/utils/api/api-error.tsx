import { ApiErrorResponse } from "./api-error-response";

export class ApiError extends Error {

    apiErrorResponse: ApiErrorResponse;

    constructor(apiErrorResponse: ApiErrorResponse) {
        super(apiErrorResponse.errorDescription);
        this.apiErrorResponse = apiErrorResponse
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}