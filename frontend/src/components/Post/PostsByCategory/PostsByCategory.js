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

    const [postsByCategory, setPostsByCategory] = useState([]);
    const [error, setError] = useState();

    const [loading, setLoading] = useState(false);

    // Get the posts by category on component load and whenever posts prop changes.
    useEffect(() => {
        setPostsByCategory(props.posts.filter(post => 
            post.category === categoryId));
    }, [props.posts, categoryId]);
    

    async function sortPosts(order) {
        try {
            const json = await fetchPostsByCategory(order, categoryId);
            setPostsByCategory(json);
        } catch(error) {
            throw error;
        }
    }

    useEffect(() => {

        // We only want this to run when order is defined (i.e. we do not want this function to run when user first 
        // visits posts by category.)
        if (!order) {
            return;
        }

        async function getSortedPosts() {
            setLoading(true);
            try {
                await sortPosts(order);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        getSortedPosts();
        // eslint-disable-next-line
    }, [order]);

    useEffect(() => {
        reLogin();
        // eslint-disable-next-line
    }, []);

    function getOutput() {
        if (error || props.postLoadingError) {
            return (
                <div
                    className={styles["posts"]}
                    style={{ "margin-top": "100px" }}
                >
                    <ErrorMessage errorMessage="Could not load posts. Please try again later." />
                </div>
            );
        } else if (loading || props.postsLoading) {
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
                    {postsByCategory.map((post) => (
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
    posts: PropTypes.array,
    upvote: PropTypes.func,
    userPostVotes: PropTypes.array,
    trackUsersUpvotes: PropTypes.func,
    downvote: PropTypes.func,
    trackUsersDownvotes: PropTypes.func,
    deletePost: PropTypes.func,
    editPostContent: PropTypes.func,
    postsLoading: PropTypes.bool,
    postLoadingError: PropTypes.instanceOf(Error)
};

export default PostsByCategory;
