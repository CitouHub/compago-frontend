import {useLocation, Navigate} from "react-router-dom";
import { useAuth } from "../context/auth/auth-provider";
import { LOGIN, NO_ACCESS } from "../infrastructure/route";
import { hasRouteAccess } from "../infrastructure/route-access";
import { Role } from "../common/role";
import { ReactElement } from "react";

export default function RequireAuth({ children, roles }: { children: ReactElement, roles: Role[] }) {
    let auth = useAuth();
    let location = useLocation();

    if (auth.userSecurityCredentials === null) {
        return <Navigate to={LOGIN} state={{ from: location }} replace />;
    }

    if (roles !== undefined && roles.length > 0 && !hasRouteAccess(roles, auth.userSecurityCredentials.roleId!)) {
        return <Navigate to={NO_ACCESS} />;
    }

    return children;
}
