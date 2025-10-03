import { GridColDef } from "@mui/x-data-grid";

export const userListColumns: GridColDef[] = [
    { field: 'username', headerName: 'Username', flex: 2 },
    { field: 'roleName', headerName: 'Role', flex: 1 }
];