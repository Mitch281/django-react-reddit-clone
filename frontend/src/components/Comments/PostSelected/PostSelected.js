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
        if (props.posts.length !== 0) {
            setPostSelected(props.posts.find((post) => post.id === postId));
        }
    }, [props.posts]);


    // Note that we have to check if props.posts.length is non zero because if not, we will try to access an empty object's
    // contents which will result in an error. This is not necessary when we use an array such as in PostsByCategory
    // because we are simply mapping through an empty array when props.posts is empty which is allowed.
    return (
        <>
            {props.posts.length !== 0 ? (
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
            ) : (
                ""
            )}
        </>
    );
};

PostSelected.propTypes = {
    posts: PropTypes.array,
    upvote: PropTypes.func,
    userPostVotes: PropTypes.array,
    trackUsersUpvotes: PropTypes.func,
    downvote: PropTypes.func,
    trackUsersDownvotes: PropTypes.func,
    deletePost: PropTypes.func,
    editPostContent: PropTypes.func,
};

export default PostSelected;
