import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";
import { useState, useContext } from "react";
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

const Post = ({ postId }) => {
    const post = useSelector((state) => selectPostById(state, postId));

    const [currentlyEditing, setCurrentlyEditing] = useState(false);

    const votes = {
        numUpvotes: post.num_upvotes,
        numDownvotes: post.num_downvotes,
    };

    const { userIdLoggedIn } = useContext(UserContext);

    return (
        <div className={styles["post"]}>
            <div className={styles["top-post-flex-container"]}>
                <PostVotes postId={postId} />
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
};

export default Post;