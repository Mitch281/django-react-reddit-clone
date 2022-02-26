import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Post from "../../Post/Post/Post";
import PropTypes from "prop-types";
import styles from "./post-selected.module.css";

const PostSelected = (props) => {
    const [postSelected, setPostSelected] = useState({});

    const params = useParams();
    const postId = params.postId;

    // Get post selected on component load and whenever posts changes.
    useEffect(() => {
        setPostSelected(props.posts.find((post) => post.id === postId));
    }, [props.posts]);

    return (
        <div className={styles["posts"]}>
            <Post
                key={postId}
                id={postId}
                username={postSelected.username}
                userId={postSelected.user}
                categoryId={postSelected.category}
                categoryName={postSelected.category_name}
                title={postSelected.title}
                content={postSelected.content}
                numUpvotes={postSelected.num_upvotes}
                numDownvotes={postSelected.num_downvotes}
                dateCreated={postSelected.date_created}
                upvote={props.upvote}
                userPostVotes={props.userPostVotes}
                trackUsersUpvotes={props.trackUsersUpvotes}
                downvote={props.downvote}
                trackUsersDownvotes={props.trackUsersDownvotes}
                deletePost={props.deletePost}
                editPostContent={props.editPostContent}
            />
        </div>
    );
};

PostSelected.propTypes = {
    upvote: PropTypes.func,
    userPostVotes: PropTypes.array,
    trackUsersUpvotes: PropTypes.func,
    downvote: PropTypes.func,
    trackUsersDownvotes: PropTypes.func,
    deletePost: PropTypes.func,
    editPostContent: PropTypes.func,
};

export default PostSelected;
