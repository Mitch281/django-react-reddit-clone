import PropTypes from "prop-types";
import { getTimeElapsedFromCreation } from "../../../utils/date-time-functions";

const DateOfPost = (props) => {

    return (
        <span className="post-date">
            {getTimeElapsedFromCreation(props.dateCreated)}
        </span>
    )
}

DateOfPost.propTypes = {
    dateCreated: PropTypes.string
}

export default DateOfPost

