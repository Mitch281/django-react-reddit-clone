import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Post from "../Post/Post";
import PropTypes from "prop-types";

const PostSelected = (props) => {

    const [post, setPost] = useState({});

    const { state } = useLocation();
    const params = useParams();
    const postId = params.postId;

    async function loadPost() {
        const response = await fetch(`http://localhost:8000/api/post/id=${postId}`);
        if (response.ok) {
            const json = await response.json();
            setPost(json);
        } else {
            throw new Error("couldn't load post!");
        }
    }

    useEffect(() => {
        loadPost();
    }, [props.posts]);

    // TODO: Issue where when upvoting or downvoting post in this router componenent, number of votes doesn't update. This is
    // probably because we are sending state from router, so it doesn't change until page refresh. Solution: load post selected
    // using get request with postId.

    return (
        <div className="posts">
            <Post
                key={postId}
                id={postId}
                username={state.username}
                categoryId={post.category}
                categoryName={post.category_name}
                title={post.title}
                content={post.content}
                numUpvotes={post.num_upvotes}
                numDownvotes={post.num_downvotes}
                dateCreated={post.date_created}
                upvote={props.upvote}
                userPostVotes={props.userPostVotes}
                trackUsersUpvotes={props.trackUsersUpvotes}
                downvote={props.downvote}
                trackUsersDownvotes={props.trackUsersDownvotes}
                />
        </div>
    )
}

PostSelected.propTypes = {
    upvote: PropTypes.func,
    userPostVotes: PropTypes.array,
    trackUsersUpvotes: PropTypes.func,
    downvote: PropTypes.func,
    trackUsersDownvotes: PropTypes.func
}

export default PostSelected