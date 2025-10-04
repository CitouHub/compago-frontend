import { useEffect, useState } from "react";
import { invoiceNoConversionFieldDefinitions } from "./invoice-no-conversion-field-definition";
import { invoiceConversionFieldDefinitions } from "./invoice-conversion-field-definition";
import { useToast } from "../../../../context/toast/toast-provider";
import BaseForm from "../../../../component/form/base-form";
import { Invoice } from "../../../model/invoice";
import { updateInvoiceTags } from "../../../service/invoice-tag-service";
import { getTags } from "../../../service/tag-service";
import { Tag } from "../../../model/tag";
import { FieldDefinition } from "../../../../component/form/field-definition";
import { SelectItem } from "../../../../component/form/select-item";

export default function InvoiceHandler({
    convertedCurrency,
    invoice,
    setInvoice
}: {
        convertedCurrency: boolean,
        invoice: Invoice,
        setInvoice: React.Dispatch<React.SetStateAction<Invoice>>
}) {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);

    const toast = useToast();

    useEffect(() => {
        setLoading(true);
        getTags().then(result => {
            setTags(result);
            
            const asdf = { ...invoice }
            asdf.selectedTagIds = invoice?.invoiceTags?.map(_ => _.tagId);
            setInvoice(asdf);
            setLoading(false);
        })
    }, []);

    const getFieldDefinitions = (): FieldDefinition[] => {
        const tagsSelectItems = tags.map(_ => {
            let selectItem: SelectItem = {
                id: _.id,
                name: _.name
            }
            return selectItem;
        });

        if (convertedCurrency === true) {
            invoiceConversionFieldDefinitions.find(_ => _.id === "selectedTagIds")!.values = tagsSelectItems;
            return invoiceConversionFieldDefinitions;
        } else {
            invoiceNoConversionFieldDefinitions.find(_ => _.id === "selectedTagIds")!.values = tagsSelectItems;
            return invoiceNoConversionFieldDefinitions;
        }
    }

    const handleSubmit = (invoice: Invoice) => {
        setSubmitting(true);
        updateInvoiceTags(invoice.id!, invoice!.selectedTagIds ?? []).then(result => {
            toast.addToast(`Invoice ${invoice.id} updated`, "success");
            setInvoice({...invoice, invoiceTags: result});
            setSubmitting(false);
        }).catch((error) => {
            if (error?.apiErrorResponse?.errorCode === 404) {
                toast.addToast(`The tags not found`, "error");
            } else {
                toast.addToast(`Unable to update invoice ${invoice.id}`, "error");
            }
            setSubmitting(false);
        });
    }

    return (
        <BaseForm
            name={invoice.id}
            model={invoice}
            setModel={setInvoice}
            fields={getFieldDefinitions()}
            submitEntity={handleSubmit}
            submitting={submitting || loading}
        />
    );
}

