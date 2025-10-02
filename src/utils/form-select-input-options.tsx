import { SelectItem } from "../component/form/select-item";
import { Role, roles } from "../common/role";

export const userRoleOptions = () => {
    return roles.map(_ => {
        let selectItem: SelectItem = {
            id: _,
            name: Role[_].replace('_', ' ')
        }
        return selectItem;
    });
}