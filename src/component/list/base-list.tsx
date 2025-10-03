import React, { useEffect, useState } from 'react';
import {
    DataGrid,
    GridCsvExportOptions,
    GridCsvGetRowsToExportParams,
    GridFilterState,
    GridSortingState,
    GridState,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarFilterButton,
    gridExpandedSortedRowIdsSelector,
    gridSortedRowIdsSelector,
    useGridApiContext
} from '@mui/x-data-grid';
import { Button, ButtonProps, FormHelperText } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { DatePicker } from "@mui/x-date-pickers";
import { getGridState } from '../../utils/helper/datagrid-helper';
import styles from "../../section/style/crud-control.module.css"
import AddIcon from '@mui/icons-material/Add';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useCache } from '../../context/cache/cache-provider';

export const LIST_FILTER_FROM_DATE_SUFFIX: string = "LIST_FILTER_FROM_DATE";
export const LIST_FILTER_TO_DATE_SUFFIX: string = "LIST_FILTER_TO_DATE";
export const LIST_FILTER_STATE_SUFFIX: string = "LIST_FILTER_STATE";
export const LIST_SORTING_STATE_SUFFIX: string = "LIST_SORTING_STATE";

const getUnfilteredRows = ({ apiRef }: GridCsvGetRowsToExportParams) =>
    gridSortedRowIdsSelector(apiRef);

const getFilteredRows = ({ apiRef }: GridCsvGetRowsToExportParams) =>
    gridExpandedSortedRowIdsSelector(apiRef);

enum InvalidDaySpan {
    Upper,
    Lower
}

export const BaseList = (
    props: Omit<React.ComponentProps<typeof DataGrid>, "classes"> & {
        storageKey: string,
        onAddClick?(): void | undefined,
        addButtonText?: string | undefined
        from?: Dayjs | null | undefined,
        to?: Dayjs | null | undefined,
        maxDaySpan?: number | undefined,
        setFrom?: React.Dispatch<React.SetStateAction<Dayjs | null>> | undefined,
        setTo?: React.Dispatch<React.SetStateAction<Dayjs | null>> | undefined,
        exportName?: string | undefined
    }
) => {
    const [daySpanInvalid, setDaySpanInvalid] = useState<InvalidDaySpan | undefined>();

    const cache = useCache();

    useEffect(() => {
        const today = new Date();
        const past = new Date();
        if(props.maxDaySpan !== undefined) {
            past.setDate(past.getDate() - props.maxDaySpan);
        } else {
            past.setMonth(past.getMonth() - 3);
        }

        if (props.setFrom !== undefined && props.setTo !== undefined) {
            const fromCache = dayjs(cache.keys[`${props.storageKey}_${LIST_FILTER_FROM_DATE_SUFFIX}`] ?? past);
            const toCache = dayjs(cache.keys[`${props.storageKey}_${LIST_FILTER_TO_DATE_SUFFIX}`] ?? today);

            props.setFrom(fromCache);
            props.setTo(toCache);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.maxDaySpan]);

    useEffect(() => {
        if (props.to !== undefined && 
            props.to !== null && 
            props.from !== undefined && 
            props.from !== null
        ) {
            if(props.maxDaySpan !== undefined && props.to.diff(props.from, 'day') > props.maxDaySpan) {
                setDaySpanInvalid(InvalidDaySpan.Upper);
            } else if (props.to.diff(props.from, 'day') < 0) {
                setDaySpanInvalid(InvalidDaySpan.Lower);
            } else {
                setDaySpanInvalid(undefined);
                cache.keys[`${props.storageKey}_${LIST_FILTER_FROM_DATE_SUFFIX}`] = props.from.toISOString()
                cache.keys[`${props.storageKey}_${LIST_FILTER_TO_DATE_SUFFIX}`] = props.to.toISOString()
            }
        } else {
            setDaySpanInvalid(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.from, props.to, props.maxDaySpan])

    const saveState = (state: GridState) => {
        localStorage.setItem(`${props.storageKey}_${LIST_FILTER_STATE_SUFFIX}`, JSON.stringify(state.filter));
        localStorage.setItem(`${props.storageKey}_${LIST_SORTING_STATE_SUFFIX}`, JSON.stringify(state.sorting));
    }

    function CustomExportToolbar() {
        const apiRef = useGridApiContext();

        const handleExport = (options: GridCsvExportOptions) => {
            options.fileName = (props.exportName ?? props.storageKey).toLowerCase().replaceAll(' ', '_');
            options.delimiter = ';';
            options.utf8WithBom = true;
            apiRef.current.exportDataAsCsv(options);
        }

        const buttonBaseProps: ButtonProps = {
            color: 'primary',
            size: 'small',
            startIcon: <FileDownloadIcon />,
        };

        return (
            <GridToolbarContainer>
                <Button
                    {...buttonBaseProps}
                    onClick={() => handleExport({ getRowsToExport: getFilteredRows })}
                >
                    Export filtered
                </Button>
                <Button
                    {...buttonBaseProps}
                    onClick={() => handleExport({ getRowsToExport: getUnfilteredRows })}
                >
                    Export all
                </Button>
            </GridToolbarContainer>
        );
    }

    return (
        <React.Fragment>

            {props.onAddClick !== undefined && props.addButtonText !== undefined && <div className={styles.top}>
                <div className={styles.control} >
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => props.onAddClick !== undefined ? props.onAddClick() : {}}
                    >
                        {props.addButtonText}
                    </Button>
                </div>
            </div>}

            {props.setFrom !== undefined && props.setTo !== undefined && <div style={{ paddingBottom: '1.5rem' }}>
               <div style={{ display: 'flex', gap: '1rem' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="From"
                            value={props.from}
                            format="YYYY-MM-DD"
                            onChange={(newValue) => {
                                if (props.setFrom !== undefined) {
                                    const newFrom = newValue ?? dayjs();
                                    props.setFrom(newFrom);
                                }
                            }} />
                        <DatePicker
                            label="To"
                            value={props.to}
                            format="YYYY-MM-DD"
                            disableFuture
                            onChange={(newValue) => {
                                if (props.setTo !== undefined) {
                                    const newTo = newValue ?? dayjs();
                                    props.setTo(newTo);
                                }
                            }} />
                    </LocalizationProvider>
                </div>
                {daySpanInvalid === InvalidDaySpan.Upper && <FormHelperText error={true} id={`base-list-span-helper-text`}>The day span for the filter must be less then or equal to {props.maxDaySpan} days</FormHelperText>}
                {daySpanInvalid === InvalidDaySpan.Lower && <FormHelperText error={true} id={`base-list-span-helper-text`}>The day span for the filter must be more then or equal to 0 days</FormHelperText>}
            </div>}

            <DataGrid
                {...props}
                rows={props.rows ?? []}
                autoHeight={true}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 25,
                        },
                    },
                    filter: getGridState<GridFilterState>(`${props.storageKey}_${LIST_FILTER_STATE_SUFFIX}`),
                    sorting: getGridState<GridSortingState>(`${props.storageKey}_${LIST_SORTING_STATE_SUFFIX}`)
                }}
                pageSizeOptions={[25]}
                rowHeight={32}
                slotProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}
                slots={{
                    //loadingOverlay: LinearProgress,
                    toolbar: () => {
                        return (
                            <GridToolbarContainer>
                                <div className={styles.listToolbarContent} >
                                    <div>
                                        <GridToolbarColumnsButton />
                                        <GridToolbarFilterButton />
                                    </div>

                                    {(props.rows ?? []).length > 0 && CustomExportToolbar()}
                                </div>
                            </GridToolbarContainer>
                        )
                    }
                }}
                // disableRowSelectionOnClick={props.disableRowSelectionOnClick === false ? false : true}
                // onStateChange={(state: GridState) => saveState(state)}
            />
        </React.Fragment>
    )
};