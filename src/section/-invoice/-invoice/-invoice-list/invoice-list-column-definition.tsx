import { GridColDef } from "@mui/x-data-grid";
import { renderDate, renderTags } from "../../../../utils/table-column-renders";
import { SupportedExternalSource } from "../../../../common/supported-external-source";

export const invoiceListColumns: GridColDef[] = [
    { field: 'source', headerName: 'Source', flex: 0.5, renderCell: (params) => { return SupportedExternalSource[params.row.source] } },
    { field: 'id', headerName: 'Id', flex: 1 },
    { field: 'date', headerName: 'Issue date', flex: 0.5, renderCell: (params) => { return renderDate(params.row.date) }},
    { field: 'originalCurrency', headerName: 'Original currency', flex: 0.5 },
    { field: 'currency', headerName: 'Currency', flex: 0.5 },
    { field: 'exchangeRate', headerName: 'Exchange rate', flex: 0.5 },
    { field: 'price', headerName: 'Price', flex: 0.5 },
    { field: 'invoiceTags', headerName: 'Tags', flex: 1, renderCell: (params) => { return renderTags(params.row.invoiceTags) }}
];