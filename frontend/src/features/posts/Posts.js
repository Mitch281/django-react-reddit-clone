import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../app/App";
import ErrorMessage from "../../common/error-message/ErrorMessage";
import OrderOptions from "../../common/ordering/OrderOptions";
import useStateRef from "../../hooks/useStateRef";
import { constants } from "../../utils/constants";
import { fetchUsersVotesOnPosts } from "../users/usersVotesOnPostsSlice";
import Post from "./Post";
import {
    fetchPosts,
    fetchPostsByCategory,
    resetPosts,
    selectPostIds,
    selectPostIdsByPageNumber,
} from "./postsSlice";
import styles from "./styles/posts.module.css";

const Posts = () => {
    const { userIdLoggedIn } = useContext(UserContext);
    const params = useParams();
    const order = params.order;

    const { state } = useLocation();
    let categoryId;
    if (state) {
        // State will always have a categoryId in this component, so no need to check if the categoryId property exists.
        categoryId = state.categoryId;
    }

    const dispatch = useDispatch();
    const postStatus = useSelector((state) => state.posts.status);
    const postIds = useSelector(selectPostIds);
    const initialPageNumber = useSelector((state) => state.posts.pageNumber);
    const pageNumber = useStateRef(initialPageNumber);
    const postIdsByPageNumber = useSelector(selectPostIdsByPageNumber);
    const usersVotesOnPostsStatus = useSelector(
        (state) => state.usersVotesOnPosts.status
    );
    const initialhHasMorePosts = useSelector(
        (state) => state.posts.hasMorePosts
    );
    const hasMorePosts = useStateRef(initialhHasMorePosts);

    function handleScroll(e) {
        if (
            window.innerHeight + e.target.documentElement.scrollTop + 1 >=
                e.target.documentElement.scrollHeight &&
            hasMorePosts.current
        ) {
            if (categoryId) {
                dispatch(
                    fetchPostsByCategory({
                        order: order,
                        categoryId: categoryId,
                        pageNumber: pageNumber.current,
                    })
                );
            } else {
                dispatch(
                    fetchPosts({ order: order, pageNumber: pageNumber.current })
                );
            }
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
            dispatch(fetchPosts({ order: order, pageNumber: 1 }));
        } else {
            dispatch(
                fetchPostsByCategory({ order: order, categoryId: categoryId })
            );
        }
        // eslint-disable-next-line
    }, [dispatch, order, categoryId]);

    let content;

    if (postStatus === "rejected") {
        content = (
            <div className={styles["posts"]} style={{ marginTop: "100px" }}>
                <ErrorMessage errorMessage="Could not load posts. Please try again later." />
            </div>
        );
    } else if (postStatus === "pending") {
        content = [];
        const existingPosts = postIdsByPageNumber
            .filter(
                (postIdByPageNumber) =>
                    postIdByPageNumber.pageNumber !== pageNumber.current
            )
            .map((postIdByPageNumber) => (
                <Post
                    key={postIdByPageNumber.id}
                    postId={postIdByPageNumber.id}
                />
            ));
        content.push(existingPosts);
        content.push(
            <div className={styles["posts"]} key="loader">
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
