import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../App";
import { useLocation, useParams } from "react-router-dom";
import Post from "../Post/Post";
import PropTypes from "prop-types";
import OrderOptions from "../../OrderOptions/OrderOptions";
import styles from "../Posts/posts.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../../constants";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import { fetchPostsByCategory } from "../../../utils/fetch-data";

const PostsByCategory = (props) => {
    const { reLogin } = useContext(UserContext);

    const params = useParams();
    const categoryName = params.categoryName;
    const order = params.order;

    const { state } = useLocation();
    const categoryId = state.categoryId;

    const [posts, setPosts] = useState([]);
    const [error, setError] = useState();

    const [loading, setLoading] = useState(false);

    async function loadPostsByCategory(order) {
        setLoading(true);
        try {
            const json = await fetchPostsByCategory(order, categoryId);
            setPosts(json);
        } catch(error) {
            throw error;
        }
    }

    useEffect(() => {
        reLogin();
    }, []);

    useEffect(() => {
        loadPostsByCategory(order)
        .then(() => setLoading(false))
        .catch((error) => setError(error));
    }, [params]);

    function getOutput() {
        if (error) {
            return (
                <div
                    className={styles["posts"]}
                    style={{ "margin-top": "100px" }}
                >
                    <ErrorMessage errorMessage="Could not load posts. Please try again later." />
                </div>
            );
        } else if (loading) {
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
                <h1 id={styles["category-name-top-page"]}>{categoryName}</h1>
                <OrderOptions />
                <div className={styles["posts"]}>
                    {posts.map((post) => (
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

PostsByCategory.propTypes = {
    upvote: PropTypes.func,
    userPostVotes: PropTypes.array,
    trackUsersUpvotes: PropTypes.func,
    downvote: PropTypes.func,
    trackUsersDownvotes: PropTypes.func,
    deletePost: PropTypes.func,
    editPostContent: PropTypes.func,
};

export default PostsByCategory;
