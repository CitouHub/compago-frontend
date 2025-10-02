import { FieldDefinition } from "../../component/form/field-definition";

export const loginFieldDefinitions: FieldDefinition[] = [
    {
        id: "username",
        name: "Username",
        type: "text",
        required: true,
        disabled: false
    },
    {
        id: "password",
        name: "Password",
        type: "text",
        required: true,
        disabled: false
    }
];