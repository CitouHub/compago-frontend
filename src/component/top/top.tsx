import React, { useEffect, useState } from 'react';
import logo from "../../assets/logo.png";
import { matchPath } from 'react-router';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/auth/auth-provider';
import styles from './style/top.module.css';
import { ROUTE_SETUP, getAccessibleRoutes } from '../../infrastructure/route-setup';
import MenuMobile from '../menu/menu-mobile';
import { useCache } from '../../context/cache/cache-provider';
import { LOGIN } from '../../infrastructure/route';
import { Role } from '../../common/role';

const ROUTE_SEGMENT_MAX_LENGTH: number = 25;

interface RouteSegment {
    id: number,
    name: string,
    uri: string,
    uriStructure: string
}

export default function Top() {
    const [routeInfo, setRouteInfo] = useState<RouteSegment[]>([]);
    const [history, setHistory] = useState<string[]>([]);

    const location = useLocation();
    const auth = useAuth();
    const navigate = useNavigate();
    const cache = useCache();

    const accessibleRoutes = getAccessibleRoutes(auth.userSecurityCredentials?.roleId ?? Role.NoRole);

    function getRouteSegments(path: string, routes: RouteSegment[]): RouteSegment[] {
        const route = ROUTE_SETUP.flatMap(rc => rc.routes).find(r => r.paths.find(p => matchPath(p, path)));
        if (path.length > 0) {
            if (route !== undefined) {
                const pathMatch = route.paths.find(p => matchPath(p, path))!;
                routes.push({ id: routes.length + 1, name: route.name, uriStructure: pathMatch, uri: path });
            }
            
            return getRouteSegments(path.substring(0, path.lastIndexOf("/")), routes)
        }

        return routes;
    }

    function handleRouteSegmentsKeys(routeSegments: RouteSegment[]): RouteSegment[] {
        const updatedRouteSegments: RouteSegment[] = [];
        while (routeSegments.length > 0) {
            let routeSegment = routeSegments.pop();
            if (routeSegment !== undefined) {
                let path = routeSegment!.uriStructure;
                while (path.lastIndexOf(':') !== -1) {
                    let idKey = path.substring(path.lastIndexOf(':'));
                    idKey = idKey.substring(0, idKey.indexOf('/') !== -1 ? idKey.indexOf('/') : undefined);
                    let idValue = cache.keys[idKey];
                    path = path.replace(idKey, idValue ?? '');
                    routeSegment.name = path;
                }

                updatedRouteSegments.push(routeSegment)
                routeSegments.forEach(_ => _.uri = _.uri.replace(routeSegment!.uri, ''));
                routeSegments.forEach(_ => _.uriStructure = _.uriStructure.replace(routeSegment!.uriStructure, ''));
                routeSegment.uriStructure = path;
            }
        }

        return updatedRouteSegments;
    }

    function trimRouteSegments(routeSegments: RouteSegment[]): RouteSegment[] {
        routeSegments.forEach(_ => {
            // URI
            if (!_.uri.endsWith('/') && _.uri.length > 1) {
                _.uri = _.uri + '/';
            }
            if (_.uri.startsWith('/') && _.uri.length > 1) {
                _.uri = _.uri.substring(1);
            }

            // Name
            if (_.name.endsWith('/')) {
                _.name = _.name.substring(0, _.name.length - 1);
            }
            if (_.name.startsWith('/')) {
                _.name = _.name.substring(1);
            }
            _.name = _.name.replaceAll('/', ' / ');

            // Last route
            var minId = Math.min(...routeSegments.map(_ => _.id));
            if (_.id === minId && _.uri.endsWith('/')) {
                _.uri = _.uri.substring(0, _.uri.length - 1);
            }

            // Captialization
            _.name = _.name.charAt(0).toUpperCase() + _.name.slice(1);

            // Minimizing
            var items = _.name.split('/');
            var lastItem = items[items.length - 1];
            var offset = _.name.length - lastItem.length;
            _.name = _.name.length > ROUTE_SEGMENT_MAX_LENGTH + offset ? _.name.slice(0, ROUTE_SEGMENT_MAX_LENGTH + offset) + "..." : _.name
        });

        return routeSegments.filter(_ => _.uri !== '' && _.uriStructure !== '');
    }

    function isRouteSegmentsReady(routeSegments: RouteSegment[]): boolean {
        return routeSegments.filter(_ => _.uriStructure.startsWith('//')).length === 0 &&
            routeSegments.filter(_ => _.name === '').length === 0
    }

    useEffect(() => {
        let routes: RouteSegment[] = [];
        routes = getRouteSegments(location.pathname, routes);
        routes = handleRouteSegmentsKeys(routes);
        routes = trimRouteSegments(routes);

        if (isRouteSegmentsReady(routes)) {
            setRouteInfo(routes);
        }
        
        const updatedHistory = [...history];
        updatedHistory.push(location.pathname);
        setHistory(updatedHistory);
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, cache.keys]);

    function getTopBannerImage(): string {
        const image = Math.round(new Date().getTime() / 1000 / (60 * 15)) % 5 + 1;
        return styles[`topBannerImage${image}`];
    }

    const goBack = () => {
        const backPage = history[history.length - 2];
        if (backPage.match('login')) {
            auth.signOut("/");
        } else if (backPage.endsWith('/add')) {
            navigate(-2);
        } else {
            navigate(-1);
        }
    }

    const showBanner = () => {
        return matchPath(location.pathname, LOGIN) === null
    }

    return (
        <React.Fragment>
            {showBanner() && <div style={{ width: '100%' }} >
                <div className={[styles.version, styles.topBanner, styles.topBannerImage].join(' ')}>
                    <div className={styles.logoImageContainer}>
                        <img className={styles.logoImage} src={logo} alt='Compago Invoice Management logo' />
                    </div>
                </div>
                {auth.userSecurityCredentials !== null && <div className={styles.topRoute}>
                    <div className={[styles.topRouteItem, styles.topRouteMobileShow].join(' ')} style={{ padding: '0rem'}} >
                        {accessibleRoutes.length > 1 && <MenuMobile />}
                    </div>
                    <div className={[styles.topRouteItem, styles.topRouteMobileHide].join(' ')} style={{ width: '75%' }} >
                        {accessibleRoutes.length > 0 && <React.Fragment>
                            <ArrowBackIcon className={styles.back} onClick={goBack} color="primary" />
                            <span>
                                <Link className={styles.link} to={'/'} >Back</Link>&nbsp;
                            </span>
                            {routeInfo.map(_ => {
                                return <span key={_.name}>/&nbsp;
                                    {_.name && <Link
                                        to={routeInfo.filter(r => r.id > _.id).map(r => r.uri).join('') + _.uri}
                                        className={styles.link}
                                    >
                                        {_.name}
                                    </Link>}&nbsp;
                                </span>
                            })}
                        </React.Fragment>}
                    </div>
                    <div className={[styles.topRouteItem, styles.topLogout].join(' ')} style={{ paddingRight: '1rem' }} >
                        <LogoutIcon onClick={() => auth.signOut("/")} color="primary" sx={{ paddingRight: '0.5rem' }} />
                        <span>
                            <Link className={styles.link} to={'/'} onClick={() => auth.signOut("/")} >Log out</Link>
                        </span>
                    </div>
                </div>}
            </div>}
        </React.Fragment>
    )
}