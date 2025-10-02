import commonStyles from "../style/common.module.css";

export default function NoAccess() {
    return (
        <div className={commonStyles.content} >
            You do not have access to the requested section in LMS.
        </div>
    );
}
