// We will show this componenet whenever something goes wrong and it is most likely due to a server error.

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./error-message.module.css";
import { BiErrorCircle } from "react-icons/bi";

const ErrorMessage = (props) => {

    const [wantErrorMessage, setWantErrorMessage] = useState(false);

    useEffect(() => {
        setWantErrorMessage(true);
    }, []);

    function closeErrorMessage() {
        setWantErrorMessage(false);
    }

    return (
        <>
            {wantErrorMessage ?         
                <div id={styles["error-message"]}>
                    <BiErrorCircle />
                    <span>{props.errorMessage}</span>
                    <button type="button" onClick={closeErrorMessage}>X</button>
                </div> : ""
            }
        </>
    );
}

ErrorMessage.propTypes = {
    errorMessage: PropTypes.string,
}

export default ErrorMessage