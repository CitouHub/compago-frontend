import { HttpMethod, requestOptions } from "../../utils/api/request-options";
import { handleResponse, handleResponseNoContent } from "../../utils/api/response-handler";
import { InvoiceTag } from "../model/invoice-tag";

export function getInvoiceTags(tagId: number): Promise<InvoiceTag[]> {
    return fetch(`${process.env.REACT_APP_API_URL}/invoicetag/list/${tagId}`, requestOptions(HttpMethod.GET))
        .then(response => {
            return handleResponse<InvoiceTag[]>(response)
        });
}

export function addInvoiceTag(invoiceTag: InvoiceTag): Promise<InvoiceTag> {
    return fetch(`${process.env.REACT_APP_API_URL}/invoicetag`, requestOptions(HttpMethod.POST, invoiceTag))
        .then(response => {
            return handleResponse<InvoiceTag>(response)
        });
}

export function deleteInvoiceTag(invoiceTagId: number): Promise<void> {
    return fetch(`${process.env.REACT_APP_API_URL}/invoicetag/${invoiceTagId}`, requestOptions(HttpMethod.DELETE))
        .then(response => {
            return handleResponseNoContent(response)
        });
}