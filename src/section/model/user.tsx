import { Role } from "../../common/role";

export interface User {
    id?: number | undefined,
    username?: string | undefined,
    roleId?: Role | undefined
}

export const sortUserList = (users: User[]) => {
    return users
        .sort((user1, user2) => (user1?.username ?? '')
        .localeCompare((user2?.username ?? '')))
}
