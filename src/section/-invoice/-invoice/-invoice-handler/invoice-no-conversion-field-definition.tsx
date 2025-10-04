import { FieldDefinition } from "../../../../component/form/field-definition";

export const invoiceNoConversionFieldDefinitions: FieldDefinition[] = [
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
        id: "date",
        name: "Issue date",
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
        required: true,
        disabled: false
    }
];