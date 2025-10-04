import { FieldDefinition } from "../../../../component/form/field-definition";

export const invoiceConversionFieldDefinitions: FieldDefinition[] = [
    {
        id: "id",
        name: "Id",
        type: "text",
        required: true,
        disabled: true
    },
    {
        id: "price",
        name: "Price",
        type: "text",
        required: true,
        disabled: true
    },
    {
        id: "exchangeRate",
        name: "Exchange rate",
        type: "text",
        required: true,
        disabled: true
    },
    {
        id: "date",
        name: "Issue date",
        type: "text",
        required: true,
        disabled: true
    },
    {
        id: "originalCurrency",
        name: "Original currency",
        type: "text",
        required: true,
        disabled: true
    },
    {
        id: "currency",
        name: "Currency",
        type: "text",
        required: true,
        disabled: true
    },
    {
        id: "selectedTagIds",
        name: "Tags",
        type: "multi-select",
        required: false,
        disabled: false
    },
];