import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ViewLoader from "../../../component/misc/view-loader";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useCache } from "../../../context/cache/cache-provider";
import { PARAMETER_TAG_ID } from "../../../infrastructure/route";
import { Tag } from "../../model/tag";
import { getTag } from "../../service/tag-service";
import TagHandler from "./-tag-handler/tag-handler";

export const TAG_TAB_STATE: string = "TAG_TAB_STATE";
export const TAG_TAB_STATE_ADD_EDIT: string = "TAG_TAB_STATE_ADD_EDIT";

export default function TagView() {
    const { tagId } = useParams();
    const newModel = tagId === undefined;

    const [tab, setTab] = useState<string>(localStorage.getItem(TAG_TAB_STATE) ?? TAG_TAB_STATE_ADD_EDIT);
    const [loading, setLoading] = useState(true);
    const [tag, setTag] = useState<Tag>({} as Tag);

    const cache = useCache();

    useEffect(() => {
        cache.update({ key: PARAMETER_TAG_ID, value: tag?.name });
    }, [cache, tag]);

    useEffect(() => {
        if (!newModel) {
            setLoading(true);
            getTag(Number(tagId)).then(result => {
                setTag(result);
                setLoading(false);
            })
        } else {
            setLoading(false);
        }
    }, [tagId, newModel]);

    const changeTab = (newTab: string) => {
        localStorage.setItem(TAG_TAB_STATE, newTab);
        setTab(newTab);
    }

    return (
        <React.Fragment>
            <ViewLoader loading={loading} />
            {loading === false && <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={(_event: React.SyntheticEvent, newTab: string) => changeTab(newTab)}>
                        <Tab label={newModel ? "Add" : "Edit"} value={TAG_TAB_STATE_ADD_EDIT} />
                    </TabList>
                </Box>
                <TabPanel value={TAG_TAB_STATE_ADD_EDIT}>
                    <TagHandler
                        newModel={newModel}
                        tag={tag}
                        setTag={setTag}
                    />
                </TabPanel>
            </TabContext>}
        </React.Fragment>
    );
}
