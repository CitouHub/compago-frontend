import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useAuth } from "../context/auth/auth-provider";
import styles from "./style/home.module.css";
import commonStyles from "./style/common.module.css";
import { 
    ROUTE_CATEGORY_ACCOUNT_TITLE, 
    ROUTE_CATEGORY_INVOICE_TITLE, 
    ROUTE_SETUP, 
    getAccessibleRoutes } from "../infrastructure/route-setup";
import { hasCategoryAccess, hasRouteAccess } from "../infrastructure/route-access";
import { RouteCategory } from "../infrastructure/route-category";
import { Role } from "../common/role";

export default function Home() {
    const [loading, setLoading] = useState(true);

    const auth = useAuth();
    const navigate = useNavigate();

    const accessibleRoutes = getAccessibleRoutes(auth.userSecurityCredentials?.roleId ?? Role.NoRole) ;

    useEffect(() => {
        if (accessibleRoutes.length === 1) {
            navigate(accessibleRoutes[0].paths[0]);
        } else {
            setLoading(false);
        }
    }, [accessibleRoutes, navigate]);

    const getHomeRouteSetup = () => {
        const homeRouteSetup = [] as RouteCategory[];
        homeRouteSetup.push({ title: ROUTE_CATEGORY_ACCOUNT_TITLE, routes: [] })
        homeRouteSetup.push({ title: ROUTE_CATEGORY_INVOICE_TITLE, routes: [] })

        ROUTE_SETUP.forEach(_ => {
            let route = homeRouteSetup.find(hr => hr.title === _.title);

            if (route !== undefined) {
                route!.routes = route!.routes.concat(_.routes);
            }
        });

        return homeRouteSetup
    }

    return (
        <React.Fragment>
            {loading === false && <div className={commonStyles.content}>
                <h1>Welcome {auth.userSecurityCredentials?.username}!</h1>
                <span>To Compago invoice managment (CIM), here you can access and manage all invoices from different related compaines.</span>
            </div>}
            {loading === false && accessibleRoutes.length === 0 && <div className={commonStyles.content}>
                <hr />
                <span>It looks like you don't have access to any of the features in CIM Speak to the <b>Administrator</b> so that you have to correct Role.</span>
            </div>}
            {loading === false && accessibleRoutes.length > 0 && <div>
                {getHomeRouteSetup().filter(_ => hasCategoryAccess(_, auth.userSecurityCredentials?.roleId!)).map(category => (
                    <div key={category.title} className={commonStyles.content}>
                        <h2>{category.title}</h2>
                        <div key={category.title} className={styles.cardContent}>
                            {category.routes
                                .filter(route => accessibleRoutes.length > 1 || route.paths.find(_ => _ === "/") === undefined)
                                .filter(route => route.menu && hasRouteAccess(route.roles, auth.userSecurityCredentials?.roleId!))
                                .filter(route => accessibleRoutes.find(_ => _.paths[0] === route.paths[0]) !== undefined)
                                .map(route =>
                                    route.paths.map(path => (
                                        <Card sx={{ width: 300 }} key={path} >
                                            <CardActionArea>
                                                <CardContent onClick={() => navigate(path)} >
                                                    <div className={styles.cardTitle}>
                                                        <span className={styles.cardIcon} >{route.icon}</span>
                                                        <span>{route.name}</span>
                                                    </div>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {route.description}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    )
                                ))
                            }
                        </div>
                    </div>
                ))}
            </div>}
        </React.Fragment>
    );
}
