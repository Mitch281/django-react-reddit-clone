import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Post from "../../Post/Post/Post";
import PropTypes from "prop-types";
import styles from "./post-selected.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../../constants";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

const PostSelected = (props) => {
    const [postSelected, setPostSelected] = useState({});

    const params = useParams();
    const postId = params.postId;

    // Get post selected on component load and whenever posts changes.
    useEffect(() => {
        if (props.posts.length !== 0) {
            setPostSelected(props.posts.find((post) => post.id === postId));
        }
        // eslint-disable-next-line
    }, [props.posts]);

    function getOutput() {
        if (props.postLoadingError) {
            return (
                <div
                    className={styles["posts"]}
                    style={{ "margin-top": "100px" }}
                >
                    <ErrorMessage errorMessage="Could not load posts. Please try again later." />
                </div>
            );
        } else if (props.postsLoading) {
            return (
                <div className={styles["posts"]}>
                    <ClipLoader
                        css={"margin-top: 50px"}
                        color={constants.loaderColour}
                        loading={true}
                        size={150}
                    />
                </div>
            );
        }

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
    }

    return getOutput();
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
    postsLoading: PropTypes.bool,
    postLoadingError: PropTypes.instanceOf(Error),
};

export default PostSelected;
