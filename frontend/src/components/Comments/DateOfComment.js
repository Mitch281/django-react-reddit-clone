import { getTimeElapsedFromCreation } from "../../date-time-functions";
import PropTypes from "prop-types";

const DateOfComment = (props) => {
    return (
        <span className="date-from-comment">
            {getTimeElapsedFromCreation(props.dateCreated)}
        </span>
    );
}

DateOfComment.propTypes = {
    dateCreated: PropTypes.string
}

export default DateOfComment;
