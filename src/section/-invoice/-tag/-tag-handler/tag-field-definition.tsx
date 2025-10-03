import { FieldDefinition } from "../../../../component/form/field-definition";

export const tagFieldDefinitions: FieldDefinition[] = [
    {
        id: "name",
        name: "Name",
        type: "text",
        required: true,
        disabled: false
    },
    {
        id: "color",
        name: "Color",
        type: "text",
        required: true,
        disabled: false
    }
];