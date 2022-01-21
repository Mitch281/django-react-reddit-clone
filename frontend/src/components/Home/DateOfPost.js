import { useEffect } from "react";
import PropTypes from "prop-types";
import { getTimeElapsedFromPost } from "../../date-time-functions";

const DateOfPost = (props) => {

    return (
        <span className="post-date">
            {getTimeElapsedFromPost(props.dateCreated)}
        </span>
    )
}

DateOfPost.propTypes = {
    dateCreated: PropTypes.string
}

export default DateOfPost

