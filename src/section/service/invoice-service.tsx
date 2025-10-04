import { Dayjs } from "dayjs";
import { HttpMethod, requestOptions } from "../../utils/api/request-options";
import { handleResponse } from "../../utils/api/response-handler";
import { Invoice } from "../model/invoice";

export function getInvoices(
    supportedExternalSource: string,
    fromData: Dayjs,
    toData: Dayjs,
    currency?: string | undefined
): Promise<Invoice[]> {
    return fetch(`${import.meta.env.VITE_API_URL}/v1/invoice/${supportedExternalSource.toString()}/${fromData.format('YYYY-MM-DD')}/${toData.format('YYYY-MM-DD')}?currency=${currency ?? ''}`, requestOptions(HttpMethod.GET))
        .then(response => {
            return handleResponse<Invoice[]>(response)
        });
}

export function getInvoice(
    supportedExternalSource: string,
    invloiceId: string,
    currency?: string | undefined
): Promise<Invoice> {
    return fetch(`${import.meta.env.VITE_API_URL}/v1/invoice/${supportedExternalSource.toString()}/${invloiceId}/?currency=${currency ?? ''}`, requestOptions(HttpMethod.GET))
        .then(response => {
            return handleResponse<Invoice>(response)
        });
}
