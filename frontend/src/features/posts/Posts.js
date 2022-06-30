import Post from "./Post";
import { useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, fetchPostsByCategory } from "./postsSlice";
import OrderOptions from "../../common/ordering/OrderOptions";
import { useContext, useEffect } from "react";
import styles from "./styles/posts.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../constants";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { selectPostIds } from "./postsSlice";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../../App";
import { fetchUsersVotesOnPosts } from "../users/usersVotesOnPostsSlice";

const Posts = () => {
    const { userIdLoggedIn } = useContext(UserContext);
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
    const usersVotesOnPostsStatus = useSelector(state => state.usersVotesOnPosts.status);

    // Once the user logs in, we want to fetch all of their votes.
    // TODO: Maybe think about moving these calls. It doesn't
    // really belong here. Although, posts is always loaded since user is redirected to root ("/"), which always
    // renders posts, so maybe it does belong here? TBD
    useEffect(() => {
        if (userIdLoggedIn) {
            dispatch(fetchUsersVotesOnPosts(userIdLoggedIn));
        }
    }, [dispatch, userIdLoggedIn]);

    if (usersVotesOnPostsStatus === "rejected") {
        toast.error("Could not fetch your votes!", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    useEffect(() => {
        // Check if there is a category ID so that we do not accidently fetch posts twice.
        if (!categoryId) {
            dispatch(fetchPosts(order));
        } else {
            dispatch(
                fetchPostsByCategory({ order: order, categoryId: categoryId })
            );
        }
    }, [dispatch, order, categoryId]);

    let content;

    if (postStatus === "rejected") {
        content = (
            <div className={styles["posts"]} style={{ "marginTop": "100px" }}>
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
            <h1 id={styles["category-name-top-page"]}>
                {params.categoryName ? params.categoryName : "Home"}
            </h1>
            <OrderOptions />
            <div className={styles["posts"]}>{content}</div>
            <ToastContainer />
        </>
    );
};

export default Posts;
