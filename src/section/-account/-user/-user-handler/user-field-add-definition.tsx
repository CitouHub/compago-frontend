import { FieldDefinition } from "../../../../component/form/field-definition";
import { userRoleOptions } from "../../../../utils/form-select-input-options";

export const userFieldAddDefinitions: FieldDefinition[] = [
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
    },
    {
        id: "roleId",
        name: "Role",
        type: "select",
        required: true,
        disabled: false,
        values: userRoleOptions()
    }
];