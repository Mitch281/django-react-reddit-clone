import PropTypes from "prop-types";
import styles from "./error-message-modal.module.css";
import { BiErrorCircle } from "react-icons/bi";

const ErrorMessageModal = (props) => {
    return (
        <div id={styles["error-message"]}>
            <BiErrorCircle />
            <span>{props.errorMessage}</span>
        </div>
    );
};

ErrorMessageModal.propTypes = {
    errorMessage: PropTypes.string,
};

export default ErrorMessageModal;
