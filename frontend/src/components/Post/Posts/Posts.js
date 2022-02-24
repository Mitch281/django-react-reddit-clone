import { useParams } from "react-router-dom";
import Post from "../Post/Post";
import PropTypes from "prop-types";
import OrderOptions from "../../OrderOptions/OrderOptions";
import { useState, useEffect } from "react";
import styles from "./posts.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../../constants";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

const Posts = (props) => {
    const params = useParams();
    const order = params.order;

    const [error, setError] = useState();

    useEffect(() => {
        props.loadPosts(order).catch((error) => setError(error));
    }, [order]);

    function getOutput() {
        
        // Note that "error" happens when we load posts after the user presses an order (i.e. we load posts in this component)
        // while "postLoadingError" happens when the user visits the home page and consequentially, posts are loaded
        // in the App component.
        if (error || props.postLoadingError) {
            return (
                <div className={styles["posts"]} style={{"margin-top": "100px"}}>
                    <ErrorMessage errorMessage="Could not load posts. Please try again later." />
                </div>
            );
        } 
        else if (props.posts.length === 0) {
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

        return (
            <>
                <h1 id={styles["category-name-top-page"]}>Home</h1>
                <OrderOptions />
                <div className={styles["posts"]}>
                    {props.posts.map((post) => (
                        <Post
                            key={post.id}
                            id={post.id}
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
                            trackUsersUpvotes={props.trackUsersUpvotes}
                            userPostVotes={props.userPostVotes}
                            downvote={props.downvote}
                            trackUsersDownvotes={props.trackUsersDownvotes}
                            deletePost={props.deletePost}
                            editPostContent={props.editPostContent}
                        />
                    ))}
                </div>
            </>
        );
    }

    return (
        getOutput()
    );
};

Post.propTypes = {
    posts: PropTypes.object,
    upvote: PropTypes.func,
    trackUsersUpvotes: PropTypes.func,
    userPostVotes: PropTypes.array,
    downvote: PropTypes.func,
    trackUsersDownvotes: PropTypes.func,
    deletePost: PropTypes.func,
    editPostContent: PropTypes.func,
    postLoadingError: PropTypes.instanceOf(Error)
};

export default Posts;
