import { UserSecurityCredentials } from "../../section/model/user-security-credentials";

export interface AuthContextType {
    loading: boolean;
    userSecurityCredentials: UserSecurityCredentials | null | undefined;
    hasRouteAccess: (path: string) => boolean;
    signIn: (username: string, password: string, redirectTo: string) => void;
    signOut: (redirectTo: string) => void;
}