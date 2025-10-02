import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/auth-provider";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import styles from './style/menu.module.css';
import logo from "../../assets/logo.png";
import { getAccessibleRoutes, ROUTE_SETUP } from "../../infrastructure/route-setup";
import { hasCategoryAccess, hasRouteAccess } from "../../infrastructure/route-access";
import { Role } from "../../common/role";

export default function MenuDesktop() {
    const [path, setPath] = useState("");

    const location = useLocation();
    const auth = useAuth();
    const navigate = useNavigate();

    const accessibleRoutes = getAccessibleRoutes(auth.userSecurityCredentials?.roleId ?? Role.NoRole);

    useEffect(() => {
        setPath(location.pathname);
    }, [location])

    const isSelected = (link: string): boolean => {
        let selected = false;
        if (link === "/") {
            selected =  link === path;
        } else {
            selected =  path.startsWith(link);
        }

        return selected;
    }

    return (
        <React.Fragment>
            {auth.userSecurityCredentials !== null && <div className={styles.menuWrapper}>
                <div className={styles.menuNoWidthScroll}>
                    <div className={[styles.logo, styles.menuWidth].join(' ')}>
                        <div style={{ padding: '1.5rem' }}>
                            <img 
                                className={styles.logoImage} 
                                src={logo} 
                                alt='Compago Invoice Management logo' />
                        </div>
                    </div>

                    {accessibleRoutes.length > 0 && <div className={`${styles.menuOptions} ${styles.menuNoWidthScroll}`}>
                        {ROUTE_SETUP.filter(_ => hasCategoryAccess(_, auth.userSecurityCredentials?.roleId!)).map(category => (
                            <div key={category.title} className={styles.section} >
                                <span className={styles.title}>{category.title}</span>
                                <List className={styles.menuWidth}>
                                    {category.routes
                                        .filter(route => accessibleRoutes.length > 1 || route.paths.find(_ => _ === "/") === undefined)
                                        .filter(route => route.menu && hasRouteAccess(route.roles, auth.userSecurityCredentials?.roleId!))
                                        .map(route => 
                                            route.paths.map(path => (
                                                <ListItem key={route.name} disablePadding className={isSelected(path) ? styles.selectedItem : ""}>
                                                    <ListItemButton onClick={() => navigate(path)} className={styles.menuItem}>
                                                        <ListItemIcon className={styles.menuIcon}>
                                                            {React.cloneElement(route.icon, { color: isSelected(path) ? "primary" : "black" })}
                                                        </ListItemIcon>
                                                        <ListItemText primary={route.name} />
                                                    </ListItemButton>
                                                </ListItem>
                                            )
                                        ))}
                                </List>
                            </div>
                        ))}
                    </div>}
                </div>
            </div>}
        </React.Fragment>
    )
}