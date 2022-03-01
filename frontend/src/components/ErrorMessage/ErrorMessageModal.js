import PropTypes from "prop-types";
import styles from "./error-message-modal.module.css";
import { BiErrorCircle } from "react-icons/bi";
import { useEffect, useState } from "react";

// Note that this time is in milliseconds.
const RENDER_TIME = 3000;

const ErrorMessageModal = (props) => {
    const [renderError, setRenderError] = useState(true);

    // Only render error message for <RENDER_TIME> seconds.
    useEffect(() => {
        setTimeout(() => {
            setRenderError(false);
        }, RENDER_TIME);
    }, []);

    return (
        <>
            {renderError ? (
                <div id={styles["error-message"]}>
                    <BiErrorCircle />
                    <span>{props.errorMessage}</span>
                </div>
            ) : (
                ""
            )}
        </>
    );
};

ErrorMessageModal.propTypes = {
    errorMessage: PropTypes.string,
};

export default ErrorMessageModal;
