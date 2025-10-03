import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userFieldAddDefinitions } from "./user-field-add-definition";
import { userFieldUpdateDefinitions } from "./user-field-update-definition";
import { User } from "../../../model/user";
import { useToast } from "../../../../context/toast/toast-provider";
import { addUser, deleteUser, updateUser } from "../../../service/user-service";
import { 
    USER_MANAGEMENT_EDIT, 
    USER_MANAGEMENT_LIST, 
    PARAMETER_USER_ID } from "../../../../infrastructure/route";
import BaseForm from "../../../../component/form/base-form";

export default function UserHandler({
    newModel,
    user,
    setUser
}: {
        newModel: boolean,
        user: User,
        setUser: React.Dispatch<React.SetStateAction<User>>
}) {
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = (user: User) => {
        setSubmitting(true);

        if (newModel) {
            addUser(user).then(result => {
                toast.addToast(`User ${result.username} created`, "success");
                setUser(result);
                setSubmitting(false);

                navigate(USER_MANAGEMENT_EDIT.replace(PARAMETER_USER_ID, `${result.id}`))
            }).catch((error) => {
                if (error?.apiErrorResponse?.errorCode === 409) {
                    toast.addToast(`The username ${user.username} already exists`, "error");
                } else {
                    toast.addToast(`Unable to create user`, "error");
                }
                setSubmitting(false);
            });
        } else {
            updateUser(user).then(result => {
                toast.addToast(`User ${result.username} updated`, "success");
                setUser(result);
                setSubmitting(false);
            }).catch((error) => {
                if (error?.apiErrorResponse?.errorCode === 409) {
                    toast.addToast(`The email ${user.username} already exists`, "error");
                } else {
                    toast.addToast(`Unable to update user ${user.username}`, "error");
                }
                setSubmitting(false);
            });
        }
    }

    const handleDelete = () => {
        if (!newModel) {
            setDeleting(true);
            deleteUser(Number(user.id)).then(() => {
                toast.addToast(`User ${user.username} deleted`, "success");
                setDeleting(false);
                navigate(USER_MANAGEMENT_LIST);
            }).catch(() => {
                toast.addToast(`Unable to delete user ${user.username}`, "error");
                setDeleting(false);
            });
        }
    }

    return (
        <BaseForm
            name={user.username}
            model={user}
            setModel={setUser}
            fields={newModel === true ? userFieldAddDefinitions : userFieldUpdateDefinitions}
            submitEntity={handleSubmit}
            deleteEntity={!newModel ? handleDelete : undefined}
            submitting={submitting}
            deleting={deleting}
        />
    );
}
