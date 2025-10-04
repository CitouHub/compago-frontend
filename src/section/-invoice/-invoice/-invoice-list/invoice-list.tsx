import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoiceListColumns } from "./invoice-list-column-definition";
import commonStyles from "../../../style/common.module.css";
import { PARAMETER_INVOICE_ID, INVOICE_MANAGEMENT_ADD_TAGS, PARAMETER_INVOICE_SOURCE, PARAMETER_INVOICE_CURRENCY } from "../../../../infrastructure/route";
import { INVOICE_TAB_STATE } from "../invoice-view";
import { useCache } from "../../../../context/cache/cache-provider";
import { BaseList } from "../../../../component/list/base-list";
import { Currency } from "../../../../common/currency";
import { Invoice } from "../../../model/invoice";
import dayjs, { Dayjs } from "dayjs";
import { getInvoices } from "../../../service/invoice-service";
import { SupportedExternalSource, supportedExternalSources } from "../../../../common/supported-external-source";
import BaseForm from "../../../../component/form/base-form";
import { invoiceFilterFieldDefinitions } from "./invoice-filter-field-definition";
import { FieldDefinition } from "../../../../component/form/field-definition";

interface InvoiceFilter {
    from: Dayjs,
    to: Dayjs,
    currency: Currency 
}

export default function InvoiceList() {
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [filter, setFilter] = useState<InvoiceFilter>({
        from: dayjs('2025-01-01'),
        to: dayjs('2025-12-01'),
        currency: Currency.Original
    })

    const navigate = useNavigate();
    const cache = useCache();

    useEffect(() => {
        setLoading(true);

        let calls: Promise<Invoice[]>[] = [];
        supportedExternalSources.forEach(source => {
            let invoiceCall = getInvoices(
                SupportedExternalSource[source], 
                filter.from, 
                filter.to, 
                (filter.currency === Currency.Original ? undefined : Currency[filter.currency]));
            calls.push(invoiceCall);
        });

        Promise.all(calls).then(result => {
            let allInvoices: Invoice[] = [];
            result.forEach(sourceInvoices => {
                allInvoices = [...allInvoices, ...sourceInvoices];
            })

            setInvoices(allInvoices);
            setLoading(false);
        });
    }, [filter]);

    const getFieldDefinitions = (): FieldDefinition[] => {
        if (loading) {
            invoiceFilterFieldDefinitions.find(_ => _.id === "from")!.disabled = true;
            invoiceFilterFieldDefinitions.find(_ => _.id === "to")!.disabled = true;
            invoiceFilterFieldDefinitions.find(_ => _.id === "currency")!.disabled = true;
        } else {
            invoiceFilterFieldDefinitions.find(_ => _.id === "from")!.disabled = false;
            invoiceFilterFieldDefinitions.find(_ => _.id === "to")!.disabled = false;
            invoiceFilterFieldDefinitions.find(_ => _.id === "currency")!.disabled = false;
        }

        return invoiceFilterFieldDefinitions;
    }

    const openEdit = (supportedExternalSource: SupportedExternalSource, invoiceId: string, currency: string) => {
        const invoice = invoices.find(_ => _.id === invoiceId && _.source === supportedExternalSource);
        cache.update({ key: PARAMETER_INVOICE_ID, value: `${invoice?.source}${invoice?.id}`});

        localStorage.removeItem(INVOICE_TAB_STATE);
        navigate(INVOICE_MANAGEMENT_ADD_TAGS
            .replace(PARAMETER_INVOICE_ID, invoice!.id!)
            .replace(PARAMETER_INVOICE_SOURCE, SupportedExternalSource[invoice!.source!])
            .replace(PARAMETER_INVOICE_CURRENCY, filter.currency === Currency.Original ? invoice!.currency! : currency))
    }

    return (
        <div className={commonStyles.content} >
            <div>
                <BaseForm
                    name="Invoice filter"
                    model={filter}
                    setModel={setFilter}
                    fields={getFieldDefinitions()}
                />
            </div>
            <BaseList
                storageKey="INVOICE"
                rows={invoices}
                columns={invoiceListColumns}
                loading={loading}
                localeText={{ noRowsLabel: "No invoices" }}
                getRowId={(row) => row?.id}
                onRowClick={(e) => openEdit(e.row?.source, e.row?.id, e.row?.currency)}
            />
        </div>
    );
}
