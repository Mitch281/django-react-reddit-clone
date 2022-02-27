// We will show this componenet whenever something goes wrong and it is most likely due to a server error.

import PropTypes from "prop-types";
import styles from "./error-message.module.css";
import { BiErrorCircle } from "react-icons/bi";

const ErrorMessage = (props) => {

    return (
        <div id={styles["error-message"]}>
            <BiErrorCircle />
            <span>{props.errorMessage}</span>
        </div>
    );
}

ErrorMessage.propTypes = {
    errorMessage: PropTypes.string,
}

export default ErrorMessage