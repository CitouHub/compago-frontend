import { Outlet } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import styles from "./style/layout.module.css";
import Top from "../component/top/top";
import MenuDesktop from "../component/menu/menu-desktop";
import { useAuth } from "../context/auth/auth-provider";

const theme = createTheme({
    palette: {
        primary: {
            main: "#ec6608"
        },
        secondary: {
            main: "#8d7e74"
        }
    },
});

document.documentElement.style.setProperty('--color-primary', theme.palette.primary.main);
document.documentElement.style.setProperty('--color-secondary', theme.palette.secondary.main);
document.documentElement.style.setProperty('--color-error', theme.palette.error.main);

export default function Layout() {

    const auth = useAuth();

    return (
        <ThemeProvider theme={theme}>
            <div className={styles.container} >
                {auth.userSecurityCredentials !== null && <MenuDesktop />}
                <div>
                    <Top />
                    <div className={auth.userSecurityCredentials !== null ? styles.outletWithMenu : styles.outletWithoutMenu}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}
