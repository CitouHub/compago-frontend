import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusCodes } from 'http-status-codes';
import { useToast } from "../toast/toast-provider";
import { AuthContextType } from "./auth-context-type";
import { 
    COMPAGO_PAGE_LOGOUT_RELOAD, 
    COMPAGO_USER_SECURITY_CREDENTIALS } from "../../utils/constant";
import { ApiError } from "../../utils/api/api-error";
import { UserSecurityCredentials } from "../../section/model/user-security-credentials";
import { login } from "../../section/service/user-service";
import { Role } from "../../common/role";
import { ROUTE_SETUP } from "../../infrastructure/route-setup";

let AuthContext = React.createContext<AuthContextType>(null!);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [userSecurityCredentials, setUserSecurityCredentials] = useState<UserSecurityCredentials | null | undefined>();
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const toast = useToast();

    const getErrorMessage = (errorCode: number): string => {
        switch (StatusCodes[errorCode]) {
            case StatusCodes[StatusCodes.BAD_REQUEST]: return "Invalid login request";
            case StatusCodes[StatusCodes.UNAUTHORIZED]: return "User not found";
            case StatusCodes[StatusCodes.NOT_FOUND]: return "User not found";
            default: return "Unable to login";
        }
    }

    const hasAnyRoles = (routeRoles: Role[]): boolean => {
        return routeRoles.filter(r => r === userSecurityCredentials?.roleId).length > 0
    }

    const hasRouteAccess = (path: string): boolean => {
        const route = ROUTE_SETUP.flatMap(_ => _.routes).find(_ => _.paths.find(p => p === path) !== undefined);
        if (route !== undefined) {
            return hasAnyRoles(route.roles);
        }

        return false;
    }

    const signIn = (username: string, password: string, redirectTo: string) => {
        setLoading(true);
        login(username, password).then(roleId => {
            let cred = {
                roleId: roleId,
                password: password,
                username: username
            } as UserSecurityCredentials

            localStorage.setItem(COMPAGO_USER_SECURITY_CREDENTIALS, JSON.stringify(cred));
            setUserSecurityCredentials(cred!);
            setLoading(false);
            navigate(redirectTo, { replace: true });
        }).catch(error => {
            setLoading(false);
            if (error instanceof ApiError) {
                const apiError = error as ApiError
                toast.addToast(getErrorMessage(apiError.apiErrorResponse.errorCode), "error");
            } else {
                toast.addToast(getErrorMessage(-1), "error");
            }
        })
    };

    const signOut = (redirectTo: string) => {
        localStorage.removeItem(COMPAGO_USER_SECURITY_CREDENTIALS);
        setUserSecurityCredentials(null);
        sessionStorage.setItem(COMPAGO_PAGE_LOGOUT_RELOAD, 'true');
        navigate(redirectTo, { replace: true });
    };

    let value = { userSecurityCredentials, hasRouteAccess, signIn, signOut, loading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return React.useContext(AuthContext);
}