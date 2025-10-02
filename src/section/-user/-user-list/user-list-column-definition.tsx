import { GridColDef } from "@mui/x-data-grid";
import { renderActive, renderRoles } from "../../../utils/table-column-renders";

export const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'roles', headerName: 'Roles', flex: 2, renderCell: (params) => { return renderRoles(params.row.roles) } },
    { field: 'active', headerName: 'Active', flex: 0.5, renderCell: (params) => { return renderActive(params.row.active) } }
];