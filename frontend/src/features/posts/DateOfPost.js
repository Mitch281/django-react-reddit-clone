import { getTimeElapsedFromCreation } from "../../utils/date-time-functions";

const DateOfPost = ({ dateCreated }) => {

    return (
        <span className="post-date">
            {getTimeElapsedFromCreation(dateCreated)}
        </span>
    )
}

export default DateOfPost

