import { Role } from "../../common/role";

export interface UserSecurityCredentials {
    roleId?: Role | undefined,   
    username?: string | undefined,
    password?: string | undefined
}