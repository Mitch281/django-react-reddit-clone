import { useLocation, useParams } from "react-router-dom";
import Post from "../Home/Post";
import PropTypes from "prop-types";

const PostSelected = (props) => {

    const { state } = useLocation();
    const params = useParams();
    const postId = params.postId;

    // TODO: Issue where when upvoting or downvoting post in this router componenent, number of votes doesn't update. This is
    // probably because we are sending state from router, so it doesn't change until page refresh. Solution: load post selected
    // using get request with postId.

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
            downvote={props.downvote}
            userPostDownvote={props.userPostDownvote}
            />
    )
}

PostSelected.propTypes = {
    upvote: PropTypes.func,
    userPostVotes: PropTypes.array,
    userPostUpvote: PropTypes.func,
    downvote: PropTypes.func,
    userPostDownvote: PropTypes.func
}

export default PostSelected