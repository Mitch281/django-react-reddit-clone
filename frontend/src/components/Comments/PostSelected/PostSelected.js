import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Post from "../../Post/Post/Post";
import PropTypes from "prop-types";
import styles from "./post-selected.module.css";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import ClipLoader from "react-spinners/ClipLoader";
import {constants} from "../../../constants";
import { fetchPost } from "../../../utils/fetch-data";

const PostSelected = (props) => {

    const [post, setPost] = useState({});

    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const postId = params.postId;

    async function loadPost() {
        setLoading(true);
        try {
            const json = await fetchPost(postId);
            setPost(json);
        } catch(error) {
            throw error;
        }
    }

    useEffect(() => {
        loadPost()
        .then(() => setLoading(false))
        .catch(error => setError(error));
    }, [props.posts]);

    // TODO: Issue where when upvoting or downvoting post in this router componenent, number of votes doesn't update. This is
    // probably because we are sending state from router, so it doesn't change until page refresh. Solution: load post selected
    // using get request with postId.

    function getOutput() {

        if (error) {
            if (error.message !== "500") {
                return  <div className={styles["posts"]}>
                    <ErrorMessage errorMessage={"Could not load post. Please try again later"} />
                </div>
            } 
            
            // Post deleted.
            else {
                return (
                    <div className={styles["posts"]}>
                        <div className={styles["post"]}>
                            <div id={styles["post-deleted-message"]}>Post Deleted</div>
                        </div>
                    </div>
                );
            }
        }

        else if (loading) {
            return (
                <div className={styles["posts"]}>
                    <ClipLoader color={constants.loaderColour} loading={true} size={150} />
                </div>
            );
        }

        return (
            <div className={styles["posts"]}>
                <Post
                    key={postId}
                    id={postId}
                    username={post.username}
                    userId={post.user}
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
                    deletePost={props.deletePost}
                    editPostContent={props.editPostContent}
                />
        </div>
        );
    }

    return getOutput();
}

PostSelected.propTypes = {
    upvote: PropTypes.func,
    userPostVotes: PropTypes.array,
    trackUsersUpvotes: PropTypes.func,
    downvote: PropTypes.func,
    trackUsersDownvotes: PropTypes.func,
    deletePost: PropTypes.func,
    editPostContent: PropTypes.func
}

export default PostSelected