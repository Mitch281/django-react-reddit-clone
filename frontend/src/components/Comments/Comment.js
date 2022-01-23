import PropTypes from "prop-types";

const Comment = (props) => {
    return (
        <div className="comment">
        </div>
    )
}

Comment.propTypes = {
    id: PropTypes.string,
    content: PropTypes.string,
    numUpvotes: PropTypes.number,
    numDownvotes: PropTypes.number,
    dateCreated: PropTypes.string
}

export default Comment
