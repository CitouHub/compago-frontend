import { FieldDefinition } from "../../../../component/form/field-definition";
import { currencyOptions } from "../../../../utils/form-select-input-options";

export const invoiceFilterFieldDefinitions: FieldDefinition[] = [
    {
        id: "from",
        name: "From date",
        type: "date",
        required: true,
        disabled: false
    },
    {
        id: "to",
        name: "To date",
        type: "date",
        required: true,
        disabled: false
    },
    {
        id: "currency",
        name: "Currency exchange",
        type: "select",
        required: true,
        disabled: false,
        values: currencyOptions()
    }
];