import { HttpMethod, requestOptions } from "../../utils/api/request-options";
import { handleResponse } from "../../utils/api/response-handler";
import { InvoiceTag } from "../model/invoice-tag";

export function getInvoiceTags(tagId: number): Promise<InvoiceTag[]> {
    return fetch(`${import.meta.env.VITE_API_URL}/v1/invoicetag/list/${tagId}`, requestOptions(HttpMethod.GET))
        .then(response => {
            return handleResponse<InvoiceTag[]>(response)
        });
}

export function updateInvoiceTags(invoiceId: string, tagIds: number[]): Promise<InvoiceTag[]> {
    return fetch(`${import.meta.env.VITE_API_URL}/v1/invoicetag/${invoiceId}`, requestOptions(HttpMethod.POST, tagIds))
        .then(response => {
            return handleResponse<InvoiceTag[]>(response)
        });
}