import React from 'react';
import styles from './style/misc.module.css';
import { CircularProgress } from "@mui/material";

export enum ViewLoaderType {
    General,
    MultiSelectList
}

export default function ViewLoader({ 
    loading,
    viewLoaderType
}: { 
    loading: boolean,
    viewLoaderType?: ViewLoaderType | undefined
}) {
    const getStyle = () => {
        if (viewLoaderType === undefined || viewLoaderType === ViewLoaderType.General) {
            return styles.viewLoaderGeneral;
        } else if (viewLoaderType === ViewLoaderType.MultiSelectList) {
            return styles.viewLoaderMultiSelectList;
        }
    }

    return (
        <React.Fragment>
            {loading === true && <div className={getStyle()} >
                <div>
                    <CircularProgress style={{ color: 'var(--color-primary)' }} />
                </div>
            </div>}
        </React.Fragment>
    )
}