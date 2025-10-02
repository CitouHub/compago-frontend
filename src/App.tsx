import React from "react";
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary'
import CacheBuster from 'react-cache-buster';
import ToastProvider from "./context/toast/toast-provider";
import AuthProvider from "./context/auth/auth-provider";
import RequireAuth from "./auth/require-auth";
import logo from "./assets/logo.png";
import styles from "./section/style/login.module.css";
import UnknownError from "./section/error/unknown-error";
import { ROUTE_SETUP } from "./infrastructure/route-setup";
import Layout from "./section/layout";
import { LOGIN, NO_ACCESS } from "./infrastructure/route";
import NoAccess from "./section/error/no-access";
import NoRoute from "./section/error/no-route";
import LoginView from "./section/-login/login-view";
import DialogProvider from "./context/dialog/dialog-provider";
import CacheProvider from "./context/cache/cache-provider";

export default function App() {
    const LoadingPrompt = () => {
        return <div className={styles.prompt}>
            <img style={{ width: '100%' }} id="cim-logo" src={logo} alt="Compage Invoice Managment logo" />
        </div>
    }

    const apiUrl = import.meta.env.VITE_API_URL;

    console.log(apiUrl)

    return (
        <React.Fragment>
            {<ErrorBoundary FallbackComponent={UnknownError} >
                <ToastProvider>
                    <DialogProvider>
                        <AuthProvider>
                            <CacheProvider>
                                <CacheBuster
                                    currentVersion={"1.0.0"}
                                    onCacheClear={() => {}}
                                    isEnabled={process.env.NODE_ENV === 'production'}
                                    isVerboseMode={false}
                                    metaFileDirectory={'.'}
                                    loadingComponent={<LoadingPrompt />}
                                >
                                    <Routes>
                                        <Route path="/" element={<Layout />}>
                                            {ROUTE_SETUP.map(c => {
                                                return c.routes.map(r => {
                                                    return r.paths.map(p => {
                                                        return <Route index={r.index} key={p} path={p} element={
                                                            <RequireAuth roles={r.roles}>
                                                                {r.component}
                                                            </RequireAuth>}
                                                        />
                                                    })
                                                })
                                            })}
                                            <Route path={NO_ACCESS} element={
                                                <RequireAuth roles={[]}>
                                                    <NoAccess />
                                                </RequireAuth>} />
                                            <Route path="*" element={
                                                <RequireAuth roles={[]}>
                                                    <NoRoute />
                                                </RequireAuth>} />
                                            <Route path={LOGIN} element={<LoginView />} />
                                        </Route>
                                    </Routes>
                                </CacheBuster>
                            </CacheProvider>
                        </AuthProvider>
                    </DialogProvider>
                </ToastProvider>
            </ErrorBoundary>}
        </React.Fragment>
    );
}
