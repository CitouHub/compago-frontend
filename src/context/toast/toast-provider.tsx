import * as React from 'react';
import { useContext, useState, createContext } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import { ToastContextType } from './toast-context-type';

const ToastContext = createContext<ToastContextType>(null!);

export interface Toast {
    message: string,
    severity: AlertColor,
    open: boolean,
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, severity: AlertColor) => {
        const toast = {
            message: message,
            open: true,
            severity: severity
        } as Toast
        setToasts([ toast ]);
    }

    const handleClose = (toast: Toast) => {
        const index = toasts.indexOf(toast);
        if (index > -1) {
            const updatedToasts = [...toasts];
            updatedToasts.splice(index, 1);
            setToasts(updatedToasts);
        }
    }
    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {toasts.map((toast) => (
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    key={toast.message}
                    open={toast.open}
                    autoHideDuration={6000}
                    onClose={() => handleClose(toast)}>
                    <Alert onClose={() => handleClose(toast)} severity={toast.severity} sx={{ width: '100%' }}>
                        {toast.message}
                    </Alert>
                </Snackbar>
            ))}
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}