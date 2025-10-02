export interface InvoiceTag {
    invloceId: string,
    tagId: number,
    tagName: string,
    tagColor: string
}

export const sortInvoiceTagList = (invoiceTags: InvoiceTag[]) => {
    return invoiceTags
        .sort((invoiceTag1, invoiceTag2) => (invoiceTag1?.invloceId ?? '')
        .localeCompare((invoiceTag2?.invloceId ?? '')))
}