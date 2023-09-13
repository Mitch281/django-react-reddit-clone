import { getTimeElapsedFromCreation } from "../../utils/date-time-functions";

type Props = {
    dateCreated: string;
};

const DateOfPost = ({ dateCreated }: Props) => {
    return (
        <span className="post-date">
            {getTimeElapsedFromCreation(dateCreated)}
        </span>
    );
};

export default DateOfPost;
