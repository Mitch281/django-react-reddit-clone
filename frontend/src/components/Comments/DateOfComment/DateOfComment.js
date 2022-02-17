import { getTimeElapsedFromCreation } from "../../../utils/date-time-functions";
import PropTypes from "prop-types";
import styles from "./date-of-comment.module.css";

const DateOfComment = (props) => {
    return (
        <span className={styles["time-elapsed-from-comment"]}>
            {getTimeElapsedFromCreation(props.dateCreated)}
        </span>
    );
}

DateOfComment.propTypes = {
    dateCreated: PropTypes.string
}

export default DateOfComment;
