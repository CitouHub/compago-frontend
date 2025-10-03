import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tagListColumns } from "./tag-list-column-definition";
import commonStyles from "../../../style/common.module.css";
import { PARAMETER_TAG_ID, TAG_MANAGEMENT_EDIT, TAG_MANAGEMENT_ADD } from "../../../../infrastructure/route";
import { TAG_TAB_STATE } from "../tag-view";
import { useCache } from "../../../../context/cache/cache-provider";
import { BaseList } from "../../../../component/list/base-list";
import { Tag } from "../../../model/tag";
import { getTags } from "../../../service/tag-service";

export default function TagList() {
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState<Tag[]>([]);

    const navigate = useNavigate();
    const cache = useCache();

    useEffect(() => {
        setLoading(true);
        getTags().then(result => {
            setTags(result);
            setLoading(false);
        });
    }, []);

    const openAdd = () => {
        localStorage.removeItem(TAG_TAB_STATE);
        navigate(TAG_MANAGEMENT_ADD);
    }

    const openEdit = (tagId: string) => {
        const tag = tags.find(_ => _.id === Number(tagId));
        cache.update({ key: PARAMETER_TAG_ID, value: tag?.name ?? '' });

        localStorage.removeItem(TAG_TAB_STATE);
        navigate(TAG_MANAGEMENT_EDIT.replace(PARAMETER_TAG_ID, tagId))
    }

    return (
        <div className={commonStyles.content} >
            <BaseList
                storageKey="TAG"
                rows={tags}
                columns={tagListColumns}
                loading={loading}
                localeText={{ noRowsLabel: "No tags" }}
                getRowId={(row) => row?.id}
                onRowClick={(e) => openEdit(e.row?.id)}
                onAddClick={() => openAdd()}
                addButtonText="Add tag"
            />
        </div>
    );
}
