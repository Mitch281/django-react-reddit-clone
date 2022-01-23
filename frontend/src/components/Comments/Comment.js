import PropTypes from "prop-types";
import CommentContent from "./CommentContent";
import CommentVotes from "./CommentVotes";
import DateOfComment from "./DateOfComment";
import User from "./User";

const Comment = (props) => {

    const votes = {numUpvotes: props.numUpvotes, numDownvotes: props.numDownvotes};

    return (
        <div className="comment">
            <CommentVotes votes={votes} />
            <User username={props.username} />
            <DateOfComment dateCreated={props.dateCreated} />
            <CommentContent content={props.content} />
        </div>
    )
}

Comment.propTypes = {
    id: PropTypes.string,
    content: PropTypes.string,
    userId: PropTypes.string,
    numUpvotes: PropTypes.number,
    numDownvotes: PropTypes.number,
    dateCreated: PropTypes.string
}

export default Comment
