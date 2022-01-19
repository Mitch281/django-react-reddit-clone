import { useLocation, useParams } from "react-router-dom";
import Post from "../Home/Post";
import PropTypes from "prop-types";

const PostSelected = (props) => {

    const { state } = useLocation();
    const params = useParams();
    const postId = params.postId;

    return (
        <Post 
            key={postId}
            id={postId}
            username={state.username}
            categoryId={state.categoryId}
            categoryName={state.categoryName}
            title={state.title}
            content={state.content}
            numUpvotes={state.votes.numUpvotes}
            numDownvotes={state.votes.numDownvotes}
            dateCreated={state.dateCreated}
            upvote={props.upvote}
            userPostVotes={props.userPostVotes}
            userPostUpvote={props.userPostUpvote}
            />
    )
}

PostSelected.propTypes = {
    upvote: PropTypes.func,
    userPostVotes: PropTypes.array,
    userPostUpvote: PropTypes.func
}

export default PostSelected