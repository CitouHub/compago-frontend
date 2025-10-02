import { Role } from "../common/role";
import { RouteCategory } from "./route-category";

export const hasCategoryAccess = (routeCategory: RouteCategory, userRoleId: Role): boolean => {
    return routeCategory.routes.filter(_ => hasRouteAccess(_.roles, userRoleId)).length > 0;
}

export const hasRouteAccess = (routeRoles: Role[], userRoleId: Role): boolean => {
    return routeRoles.length === 0 || routeRoles.some(_ => _ === userRoleId)
}