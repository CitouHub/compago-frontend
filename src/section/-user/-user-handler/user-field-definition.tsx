import { FieldDefinition } from "../../../component/form/field-definition";
import { userRoleOptions } from "../../../utils/form-select-input-options";

export const userFieldDefinitions: FieldDefinition[] = [
    {
        id: "name",
        name: "Name",
        type: "text",
        required: true,
        disabled: false
    },
    {
        id: "role",
        name: "Role",
        type: "select",
        required: false,
        disabled: false,
        values: userRoleOptions()
    }
];