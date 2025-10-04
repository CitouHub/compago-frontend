import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../../model/user";
import { getUser } from "../../service/user-service";
import ViewLoader from "../../../component/misc/view-loader";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useCache } from "../../../context/cache/cache-provider";
import { PARAMETER_USER_ID } from "../../../infrastructure/route";
import UserHandler from "./-user-handler/user-handler";

export const USER_TAB_STATE: string = "USER_TAB_STATE";
export const USER_TAB_STATE_ADD_EDIT: string = "USER_TAB_STATE_ADD_EDIT";

export default function UserView() {
    const { userId } = useParams();
    const newModel = userId === undefined;

    const [tab, setTab] = useState<string>(localStorage.getItem(USER_TAB_STATE) ?? USER_TAB_STATE_ADD_EDIT);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>({} as User);

    const cache = useCache();

    useEffect(() => {
        cache.update({ key: PARAMETER_USER_ID, value: user?.username });
    }, [cache, user]);

    useEffect(() => {
        if (!newModel) {
            setLoading(true);
            getUser(Number(userId)).then(result => {
                setUser(result);
                setLoading(false);
            })
        } else {
            setLoading(false);
        }
    }, [userId, newModel]);

    const changeTab = (newTab: string) => {
        localStorage.setItem(USER_TAB_STATE, newTab);
        setTab(newTab);
    }

    return (
        <React.Fragment>
            <ViewLoader loading={loading} />
            {loading === false && <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={(_event: React.SyntheticEvent, newTab: string) => changeTab(newTab)}>
                        <Tab label={newModel ? "Add" : "Edit"} value={USER_TAB_STATE_ADD_EDIT} />
                    </TabList>
                </Box>
                <TabPanel value={USER_TAB_STATE_ADD_EDIT}>
                    <UserHandler
                        newModel={newModel}
                        user={user}
                        setUser={setUser}
                    />
                </TabPanel>
            </TabContext>}
        </React.Fragment>
    );
}
