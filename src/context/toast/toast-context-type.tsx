import { AlertColor } from "@mui/material/Alert";

export interface ToastContextType {
    addToast: (text: string, severity: AlertColor) => void;
};