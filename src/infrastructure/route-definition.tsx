import { Role } from "../common/role";

export interface RouteDefinition {
    index: boolean,
    menu: boolean,
    name: string,
    roles: Role[],
    paths: string[],
    icon?: any | undefined,
    component: any,
    description?: string | undefined
}