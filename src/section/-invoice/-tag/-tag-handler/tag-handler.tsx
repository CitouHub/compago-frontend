import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tagFieldDefinitions } from "./tag-field-definition";
import { useToast } from "../../../../context/toast/toast-provider";
import { 
    TAG_MANAGEMENT_EDIT, 
    TAG_MANAGEMENT_LIST, 
    PARAMETER_TAG_ID } from "../../../../infrastructure/route";
import BaseForm from "../../../../component/form/base-form";
import { Tag } from "../../../model/tag";
import { addTag, deleteTag, updateTag } from "../../../service/tag-service";

export default function TagHandler({
    newModel,
    tag,
    setTag
}: {
        newModel: boolean,
        tag: Tag,
        setTag: React.Dispatch<React.SetStateAction<Tag>>
}) {
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = (tag: Tag) => {
        setSubmitting(true);

        if (newModel) {
            addTag(tag).then(result => {
                toast.addToast(`Tag ${result.name} created`, "success");
                setTag(result);
                setSubmitting(false);

                navigate(TAG_MANAGEMENT_EDIT.replace(PARAMETER_TAG_ID, `${result.id}`))
            }).catch((error) => {
                if (error?.apiErrorResponse?.errorCode === 409) {
                    toast.addToast(`The name ${tag.name} already exists`, "error");
                } else if (error?.apiErrorResponse?.errorCode === 400) {
                    toast.addToast(`The color must be in the format of #XXXXXX`, "error");
                } else {
                    toast.addToast(`Unable to update tag ${tag.name}`, "error");
                }
                setSubmitting(false);
            });
        } else {
            updateTag(tag).then(result => {
                toast.addToast(`Tag ${result.name} updated`, "success");
                setTag(result);
                setSubmitting(false);
            }).catch((error) => {
                if (error?.apiErrorResponse?.errorCode === 409) {
                    toast.addToast(`The name ${tag.name} already exists`, "error");
                } else if (error?.apiErrorResponse?.errorCode === 400) {
                    toast.addToast(`The color must be in the format of #XXXXXX`, "error");
                } else {
                    toast.addToast(`Unable to update tag ${tag.name}`, "error");
                }
                setSubmitting(false);
            });
        }
    }

    const handleDelete = () => {
        if (!newModel) {
            setDeleting(true);
            deleteTag(Number(tag.id)).then(() => {
                toast.addToast(`Tag ${tag.name} deleted`, "success");
                setDeleting(false);
                navigate(TAG_MANAGEMENT_LIST);
            }).catch(() => {
                toast.addToast(`Unable to delete tag ${tag.name}`, "error");
                setDeleting(false);
            });
        }
    }

    return (
        <BaseForm
            name={tag.name}
            model={tag}
            setModel={setTag}
            fields={tagFieldDefinitions}
            submitEntity={handleSubmit}
            deleteEntity={!newModel ? handleDelete : undefined}
            submitting={submitting}
            deleting={deleting}
        />
    );
}
