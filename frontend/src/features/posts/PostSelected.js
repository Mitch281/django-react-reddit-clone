import { useDispatch, useSelector } from "react-redux";
import { fetchSinglePost, selectPostById } from "./postsSlice";
import { useState, useContext, useEffect } from "react";
import styles from "./styles/posts.module.css";
import { UserContext } from "../../App";
import Category from "../../components/Post/Category/Category";
import DateOfPost from "../../components/Post/DateOfPost/DateOfPost";
import PostContent from "../../components/Post/PostContent/PostContent";
import PostVotes from "./PostVotes";
import Title from "../../components/Post/Title/Title";
import User from "../../components/Comments/User/Author";
import ViewComments from "../../components/Post/ViewComments/ViewComments";
import DeletePost from "../../components/Post/DeletePost/DeletePost";
import { useParams } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { constants } from "../../constants";
import ClipLoader from "react-spinners/ClipLoader";

const PostSelected = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const postId = params.postId;
    const [currentlyEditing, setCurrentlyEditing] = useState(false);
    const postStatus = useSelector((state) => state.posts.status);
    const { userIdLoggedIn } = useContext(UserContext);

    const post = useSelector((state) => {
        if (state.posts.length === 0) {
            return null;
        }
        return selectPostById(state, postId);
    });

    useEffect(() => {
        if (!post) {
            dispatch(fetchSinglePost(postId));
        }
    }, [dispatch]);

    let content = null;
    if (post) {
        const votes = {
            numUpvotes: post.num_upvotes,
            numDownvotes: post.num_downvotes,
        };
        content = (
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
                <ViewComments postId={postId} />
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
            <div className={styles["posts"]} style={{ "margin-top": "100px" }}>
                <ErrorMessage errorMessage="Could not load posts. Please try again later." />
            </div>
        );
    }

    return content;
};

export default PostSelected;
