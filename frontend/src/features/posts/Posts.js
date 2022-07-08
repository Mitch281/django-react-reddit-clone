import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../../app/App";
import ErrorMessage from "../../common/error-message/ErrorMessage";
import OrderOptions from "../../common/ordering/OrderOptions";
import { constants } from "../../common/utils/constants";
import { fetchUsersVotesOnPosts } from "../users/usersVotesOnPostsSlice";
import Post from "./Post";
import { fetchPosts, fetchPostsByCategory, selectPostIds } from "./postsSlice";
import styles from "./styles/posts.module.css";

const Posts = () => {
    const { userIdLoggedIn } = useContext(UserContext);
    const params = useParams();
    const order = params.order;

    const { state } = useLocation();
    let categoryId;
    let successMessage;
    if (state) {
        // State will always have a categoryId in this component, so no need to check if the categoryId property exists.
        categoryId = state.categoryId;
        if (state.hasOwnProperty("successMessage")) {
            successMessage = state.successMessage;
            // TODO: DELETE SUCCESS MESSAGE AFTER STORING IT (OR ELSE WE KEEP GETTING SUCCESS MESSAGE ONCE USER ADDS POST)
        }
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
        if (successMessage) {
            toast.success(successMessage, {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
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
        </>
    );
};

export default Posts;
