import { useState } from "react";
import { useAuth } from "../../context/auth/auth-provider";
import { UserSecurityCredentials } from "../model/user-security-credentials";
import { LoadingButton } from '@mui/lab';
import { TextField } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { HOME } from "../../infrastructure/route";
import logo from "../../assets/logo.png";
import styles from "../style/login.module.css";

export default function LoginView() {
    const [userSecurityCredentials, setUserSecurityCredentials] = useState<UserSecurityCredentials>({} as UserSecurityCredentials);

    const auth = useAuth();

    const handleLogin = () => {
        auth.signIn(userSecurityCredentials.username!, userSecurityCredentials.password!, HOME)
    }

    return (
        <div className={styles.prompt}>
            <img style={{ width: '50%' }} id="cim-logo" src={logo} alt="Compago Invoice Managment logo" />
            <div className={styles.loginInput}>
                <span style={{ fontSize: '2.5rem', fontWeight: '600', padding: '1rem'}}>CMI - Login</span>
                <TextField
                    sx={{ paddingBottom: '1rem', width: '100%' }}
                    id="username"
                    label="Username"
                    value={userSecurityCredentials.username}
                    disabled={auth.loading}
                    fullWidth={true}
                    onChange={e => {
                        setUserSecurityCredentials({ ...userSecurityCredentials, username: e.target.value })
                    }}
                />
                <TextField
                    sx={{ paddingBottom: '1rem', width: '100%' }}
                    id="password"
                    label="Password"
                    value={userSecurityCredentials.password}
                    disabled={auth.loading}
                    fullWidth={true}
                    onChange={e => {
                        setUserSecurityCredentials({ ...userSecurityCredentials, password: e.target.value })
                    }}
                />
                <LoadingButton
                    sx={{ width: '100%' }}
                    id="login"
                    loadingPosition="start"
                    startIcon={<LoginIcon />}
                    variant="contained"
                    loading={auth.loading}
                    disabled={auth.loading === true || userSecurityCredentials.username === undefined || userSecurityCredentials.password === undefined}
                    onClick={() => handleLogin()}
                >
                    Login
                </LoadingButton>
            </div>
        </div>
    );
}
