import { useLocation } from "react-router-dom";
import styles from "../style/error.module.css";

export default function UnknownError({error}: {error: Error}) {
    const location = useLocation();
    const from = location.state?.from?.pathname;

    return (
        <div className={styles.unknownError}>
            <p>An error occurred:</p>
            <pre>Occurred at: {from}</pre>
            <pre>{error.name}</pre>
            <pre>{error.message}</pre>
            <pre>{error.stack}</pre>
        </div>
    )
}
