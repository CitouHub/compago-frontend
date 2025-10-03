import { GridColDef } from "@mui/x-data-grid";
import { renderColor } from "../../../../utils/table-column-renders";

export const tagListColumns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 2 },
    { field: 'color', headerName: 'Color', flex: 1 },
    { field: 'colorSample', headerName: 'Color sample', flex: 1, renderCell: (params) => { return renderColor(params.row.color) } }
];