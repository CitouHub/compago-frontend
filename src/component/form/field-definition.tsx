import { ReactElement } from "react";
import { SelectItem } from "./select-item";

export interface FieldDefinition {
    id: string;
    name: string;
    type: string;
    required: boolean;
    disabled: boolean;
    hidden?: boolean | undefined;
    fullInput?: boolean | undefined;
    adornment?: string | undefined;
    icon?: ReactElement  | undefined;
    min?: number | undefined;
    max?: number | undefined;
    values?: SelectItem[] | undefined;
    valueName?: string | undefined;
    disableFuture?: boolean | undefined;
    disablePast?: boolean | undefined;
}