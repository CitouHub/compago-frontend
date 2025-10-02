import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { columns } from "./user-list-column-definition";
import commonStyles from "../../style/common.module.css";
import { User } from "../../model/user";
import { getUsers } from "../../service/user-service";
import { USER_MANAGEMENT_ADD, USER_MANAGEMENT_EDIT, PARAMETER_USER_ID } from "../../../infrastructure/route";
import { USER_TAB_STATE } from "../user-view";
import { useCache } from "../../../context/cache/cache-provider";
import { BaseList } from "../../../component/list/base-list";

export default function UserList() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);

    const navigate = useNavigate();
    const cache = useCache();

    useEffect(() => {
        setLoading(true);
        getUsers().then(result => {
            setUsers(result);
            setLoading(false);
        });
    }, []);

    const openAdd = () => {
        localStorage.removeItem(USER_TAB_STATE);
        navigate(USER_MANAGEMENT_ADD);
    }

    const openEdit = (userId: string) => {
        const user = users.find(_ => _.id === Number(userId));
        cache.update({ key: PARAMETER_USER_ID, value: user?.username ?? '' });

        localStorage.removeItem(USER_TAB_STATE);
        navigate(USER_MANAGEMENT_EDIT.replace(PARAMETER_USER_ID, userId))
    }

    return (
        <div className={commonStyles.content} >
            <BaseList
                storageKey="USER"
                rows={users}
                columns={columns}
                loading={loading}
                localeText={{ noRowsLabel: "No users" }}
                getRowId={(row) => row?.id}
                onRowClick={(e) => openEdit(e.row?.id)}
                onAddClick={() => openAdd()}
                addButtonText="Add user"
            />
        </div>
    );
}
