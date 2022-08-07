import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import "react-toastify/dist/ReactToastify.css";
import ErrorMessage from "../../common/error-message/ErrorMessage";
import OrderOptions from "../../common/ordering/OrderOptions";
import useFetchUserVotes from "../../hooks/useFetchUserVotes";
import useStateRef from "../../hooks/useStateRef";
import { constants, VoteObjects } from "../../utils/constants";
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
    const dispatch = useDispatch();
    useFetchUserVotes(VoteObjects.Post);
    const params = useParams();
    const initialOrder = params.order;
    const order = useStateRef(initialOrder);

    const { state } = useLocation();
    let categoryId;
    if (state) {
        // State will always have a categoryId in this component, so no need to check if the categoryId property exists.
        categoryId = state.categoryId;
    }

    const postStatus = useSelector((state) => state.posts.status);
    const postIds = useSelector(selectPostIds);
    const initialPageNumber = useSelector((state) => state.posts.pageNumber);
    const pageNumber = useStateRef(initialPageNumber);
    const postIdsByPageNumber = useSelector(selectPostIdsByPageNumber);
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
                        order: order.current,
                        categoryId: categoryId,
                        pageNumber: pageNumber.current,
                    })
                );
            } else {
                dispatch(
                    fetchPosts({
                        order: order.current,
                        pageNumber: pageNumber.current,
                    })
                );
            }
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        dispatch(resetPosts());
    }, [params]);

    useEffect(() => {
        // Check if there is a category ID so that we do not accidently fetch posts twice.
        if (!categoryId) {
            dispatch(fetchPosts({ order: initialOrder, pageNumber: 1 }));
        } else {
            dispatch(
                fetchPostsByCategory({
                    order: initialOrder,
                    categoryId: categoryId,
                })
            );
        }
        // eslint-disable-next-line
    }, [dispatch, initialOrder, categoryId]);

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
