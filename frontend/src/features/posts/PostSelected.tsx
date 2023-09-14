import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { UserContext } from "../../app/App";
import { RootState } from "../../app/store";
import ErrorMessage from "../../common/error-message/ErrorMessage";
import { constants } from "../../utils/constants";
import { fetchUsersVotesOnPosts } from "../users/usersVotesOnPostsSlice";
import Post from "./Post";
import { fetchSinglePost, selectAllPosts } from "./postsSlice";
import styles from "./styles/posts.module.css";

const PostSelected = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const postId = params.postId as string;
    const posts = useSelector(selectAllPosts);
    const postStatus = useSelector((state: RootState) => state.posts.status);

    const { userIdLoggedIn } = useContext(UserContext);

    // When we refresh the page, our store is refrshed and thus, there are no posts loaded. Thus, we simply load the post we
    // want.
    useEffect(() => {
        if (posts.length === 0) {
            dispatch(fetchSinglePost(postId));

            // Since we refreshed the page, our data on the user's votes is gone. Thus, we re fetch this.
            dispatch(fetchUsersVotesOnPosts(userIdLoggedIn));
        }
        // eslint-disable-next-line
    }, [dispatch]);

    let content = null;
    if (postStatus === "fulfilled" || posts.length > 0) {
        content = <Post postId={postId} />;
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
    } else if (postStatus === "rejected") {
        content = (
            <div className={styles["posts"]}>
                <ErrorMessage errorMessage="Could not load post. Please try again later." />
            </div>
        );
    }

    return (
        // We still include the class of posts here to center the post.
        <div className={styles["posts"]}>{content}</div>
    );
};

export default PostSelected;
