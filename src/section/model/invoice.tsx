import { Dayjs } from "dayjs";
import { InvoiceTag } from "./invoice-tag";
import { SupportedExternalSource } from "../../common/supported-external-source";

export interface Invoice {
    id?: string | undefined,
    price?: number | undefined,
    exchangeRate?: number | undefined,
    date?: Dayjs | undefined,
    source?: SupportedExternalSource | undefined,
    invoiceTags?: InvoiceTag[] | undefined,
    originalCurrency?: string | undefined,
    currency?: string | undefined,
    selectedTagIds?: number[] | undefined
}