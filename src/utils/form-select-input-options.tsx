import { SelectItem } from "../component/form/select-item";
import { Role, roles } from "../common/role";
import { currencies, Currency } from "../common/currency";

export const currencyOptions = () => {
    return currencies.map(_ => {
        let selectItem: SelectItem = {
            id: _,
            name: Currency[_].replace('_', ' ')
        }
        return selectItem;
    });
}

export const userRoleOptions = () => {
    return roles.map(_ => {
        let selectItem: SelectItem = {
            id: _,
            name: Role[_].replace('_', ' ')
        }
        return selectItem;
    });
}