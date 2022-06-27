import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { UserContext } from "../../App";
import PostAuthor from "../../common/posts/PostAuthor";
import Category from "../../common/posts/Category";
import DateOfPost from "../../common/posts/DateOfPost";
import Title from "../../common/posts/Title";
import ViewComments from "../../components/Post/ViewComments/ViewComments";
import PostContent from "./PostContent";
import { selectPostById } from "./postsSlice";
import PostVotes from "./PostVotes";
import styles from "./styles/post.module.css";
import DeletePost from "./DeletePost";

const Post = ({ postId }) => {
    const post = useSelector((state) => selectPostById(state, postId));

    const [currentlyEditing, setCurrentlyEditing] = useState(false);

    const { userIdLoggedIn } = useContext(UserContext);

    let editButton;
    let deleteButton;

    if (userIdLoggedIn && userIdLoggedIn === post.user) {
        editButton = (
            <button
                type="button"
                className={styles["toggle-edit-post"]}
                onClick={() => setCurrentlyEditing(!currentlyEditing)}
            >
                Edit
            </button>
        );
        deleteButton = <DeletePost postId={postId} />;
    }

    return (
        <div className={styles["post"]}>
            <div className={styles["top-post-flex-container"]}>
                <PostVotes postId={postId} />
                <div className={styles["post-info"]}>
                    <Category
                        categoryId={post.category}
                        categoryName={post.category_name}
                    />
                    <PostAuthor username={post.username} />
                    <DateOfPost dateCreated={post.date_created} />
                </div>
            </div>
            <Title title={post.title} />
            <PostContent currentlyEditing={currentlyEditing} postId={postId} />
            {deleteButton}
            {editButton}
            <ViewComments postId={postId} />
        </div>
    );
};

export default Post;
