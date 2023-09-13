// We will show this componenet whenever something goes wrong and it is most likely due to a server error.

import PropTypes from "prop-types";
import { BiErrorCircle } from "react-icons/bi";
import styles from "./styles/error-message.module.css";

type Props = {
    errorMessage: string;
};

const ErrorMessage = ({ errorMessage }: Props) => {
    return (
        <div id={styles["error-message"]}>
            <BiErrorCircle />
            <span>{errorMessage}</span>
        </div>
    );
};

ErrorMessage.propTypes = {
    errorMessage: PropTypes.string,
};

export default ErrorMessage;
