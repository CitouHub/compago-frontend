import commonStyles from "../style/common.module.css";

export default function NoRoute() {
    return (
        <div className={commonStyles.content}>
            The requested section does not exist in LMS.
        </div>
    );
}
