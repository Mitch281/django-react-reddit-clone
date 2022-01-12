import PropTypes from "prop-types";

const PostContent = (props) => {
    return (
        <p className="post-content">
            {props.content}
        </p>
    )
}

PostContent.propTypes = {
    content: PropTypes.string
}

export default PostContent
