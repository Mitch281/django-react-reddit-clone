import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import "react-toastify/dist/ReactToastify.css";
import { AppDispatch, RootState } from "../../app/store";
import ErrorMessage from "../../common/error-message/ErrorMessage";
import OrderOptions from "../../common/ordering/OrderOptions";
import useFetchUserVotes from "../../hooks/useFetchUserVotes";
import useStateRef from "../../hooks/useStateRef";
import {
    FetchPostsByCategoryPayload,
    FetchPostsPayload,
    Order,
} from "../../types/shared";
import { VoteObjects, constants } from "../../utils/constants";
import Post from "./Post";
import {
    fetchPosts,
    fetchPostsByCategory,
    resetPosts,
    selectPostIds,
    selectPostIdsByPageNumber,
} from "./postsSlice";
import styles from "./styles/posts.module.css";

type State = {
    categoryId: string;
};

const Posts = () => {
    const dispatch = useDispatch<AppDispatch>();
    useFetchUserVotes(VoteObjects.Post);
    const params = useParams();
    const initialOrder = params.order;
    const order = useStateRef<string | undefined>(initialOrder);

    const { state }: { state: State } = useLocation() as { state: State };
    let initialCategoryId: string | undefined;
    if (state) {
        // State will always have a categoryId in this component, so no need to check if the categoryId property exists.
        initialCategoryId = state.categoryId;
    }
    const categoryId = useStateRef<string | undefined>(initialCategoryId);

    const postStatus = useSelector((state: RootState) => state.posts.status);
    const postIds = useSelector(selectPostIds);
    const initialPageNumber = useSelector(
        (state: RootState) => state.posts.pageNumber
    );
    const pageNumber = useStateRef<number>(initialPageNumber);
    const postIdsByPageNumber = useSelector(selectPostIdsByPageNumber);
    const initialHasMorePosts: boolean = useSelector(
        (state: RootState) => state.posts.hasMorePosts
    );
    const hasMorePosts = useStateRef<boolean>(initialHasMorePosts);

    function handleScroll(e: Event) {
        const target = e.target as Document;
        if (
            window.innerHeight + target.documentElement.scrollTop + 1 >=
                target.documentElement.scrollHeight &&
            hasMorePosts.current
        ) {
            if (categoryId.current) {
                const payload: FetchPostsByCategoryPayload = {
                    order: order.current as Order,
                    categoryId: categoryId.current,
                    pageNumber: pageNumber.current as number,
                };

                dispatch(fetchPostsByCategory(payload));
            } else {
                const payload: FetchPostsPayload = {
                    order: order.current as Order,
                    pageNumber: pageNumber.current as number,
                };
                dispatch(fetchPosts(payload));
            }
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        dispatch(resetPosts({}));
        // eslint-disable-next-line
    }, [initialOrder, initialCategoryId]);

    useEffect(() => {
        // Check if there is a category ID so that we do not accidently fetch posts twice.
        if (!initialCategoryId) {
            const payload: FetchPostsPayload = {
                order: initialOrder as Order,
                pageNumber: 1,
            };
            dispatch(fetchPosts(payload));
        } else {
            const payload: FetchPostsByCategoryPayload = {
                order: initialOrder as Order,
                pageNumber: 1,
                categoryId: initialCategoryId,
            };
            dispatch(fetchPostsByCategory(payload));
        }
        // eslint-disable-next-line
    }, [dispatch, initialOrder, initialCategoryId]);

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
                    color={constants.loaderColour}
                    loading={true}
                    size={150}
                />
            </div>
        );
    } else if (postStatus === "fulfilled") {
        content = postIds.map((postId) => (
            <Post key={postId} postId={postId as string} />
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
