import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, fetchPostsByCategory, selectPostById } from "./postsSlice";
import OrderOptions from "../../components/OrderOptions/OrderOptions";
import { useState, useEffect, useContext } from "react";
import styles from "./posts.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../constants";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { selectPostIds } from "./postsSlice";
import { UserContext } from "../../App";
import Category from "../../components/Post/Category/Category";
import DateOfPost from "../../components/Post/DateOfPost/DateOfPost";
import PostContent from "../../components/Post/PostContent/PostContent";
import PostVotes from "../../components/Post/PostVotes/PostVotes";
import Title from "../../components/Post/Title/Title";
import User from "../../components/Comments/User/User";
import ViewComments from "../../components/Post/ViewComments/ViewComments";
import DeletePost from "../../components/Post/DeletePost/DeletePost";

const Post = ({ postId }) => {
    const post = useSelector((state) => selectPostById(state, postId));

    const [currentlyEditing, setCurrentlyEditing] = useState(false);

    const votes = {
        numUpvotes: post.numUpvotes,
        numDownvotes: post.numDownvotes,
    };

    let navigate = useNavigate();

    const { userIdLoggedIn } = useContext(UserContext);

    // Show comments of post.
    function navigateToPost(postId) {
        navigate(`/post=${postId}/comments/`, {
            state: {
                votes: votes,
                categoryName: post.category_name,
                username: post.username,
                dateCreated: post.date_created,
                title: post.title,
                content: post.content,
                categoryId: post.category,
            },
        });
    }

    return (
        <div className={styles["post"]}>
            <div className={styles["top-post-flex-container"]}>
                <PostVotes votes={votes} postId={postId} />
                <div className={styles["post-info"]}>
                    <Category
                        categoryId={post.category}
                        categoryName={post.category_name}
                    />
                    <User username={post.username} />
                    <DateOfPost dateCreated={post.date_created} />
                </div>
            </div>
            <Title title={post.title} />
            <PostContent
                content={post.content}
                currentlyEditing={currentlyEditing}
                userId={post.user}
                postId={postId}
            />
            <ViewComments postId={postId} navigateToPost={navigateToPost} />
            {userIdLoggedIn === post.user ? (
                <DeletePost postId={postId} userId={post.user} />
            ) : (
                ""
            )}
            {userIdLoggedIn === post.user ? (
                <button
                    type="button"
                    className={styles["toggle-edit-post"]}
                    onClick={() => setCurrentlyEditing(!currentlyEditing)}
                >
                    Edit
                </button>
            ) : (
                ""
            )}
        </div>
    );
};

const Posts = () => {
    const params = useParams();
    const order = params.order;

    const { state } = useLocation();
    let categoryId;
    if (state) {
        categoryId = state.categoryId;
    }

    const dispatch = useDispatch();
    const postStatus = useSelector((state) => state.posts.status);
    const postIds = useSelector(selectPostIds);

    useEffect(() => {
        // Check if there is a category ID so that we do not accidently fetch posts twice.
        if (!categoryId) {
            dispatch(fetchPosts(order));
        } else {
            dispatch(fetchPostsByCategory({ order: order, categoryId: categoryId }));
        }
        // eslint-disable-next-line
    }, [dispatch, order, categoryId]);

    let content;

    if (postStatus === "rejected") {
        content = (
            <div className={styles["posts"]} style={{ "margin-top": "100px" }}>
                <ErrorMessage errorMessage="Could not load posts. Please try again later." />
            </div>
        );
    } else if (postStatus === "pending") {
        content = (
            <div className={styles["posts"]}>
                <ClipLoader
                    css={"margin-top: 50px"}
                    color={constants.loaderColour}
                    loading={true}
                    size={150}
                />
            </div>
        );
    } else if (postStatus === "fulfilled") {
        content = postIds.map((postId) => (
            <Post key={postId} postId={postId} />
        ));
    }

    return (
        <>
            <h1 id={styles["category-name-top-page"]}>{params.categoryName ? params.categoryName : "Home"}</h1>
            <OrderOptions />
            <div className={styles["posts"]}>{content}</div>
        </>
    );
};

export default Posts;
