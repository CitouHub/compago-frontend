import { Dayjs } from "dayjs";
import { InvoiceTag } from "./invoice-tag";
import { SupportedExternalSource } from "../../common/supported-external-source";
import { Tag } from "./tag";

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