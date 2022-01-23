import PropTypes from "prop-types";

const CommentContent = (props) => {
    return (
        <p className="comment-content">{props.content}</p>
    );
}

CommentContent.propTypes = {
    content: PropTypes.string
}

export default CommentContent;
