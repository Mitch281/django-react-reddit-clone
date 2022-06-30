import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { UserContext } from "../../app/App";
import PostAuthor from "../../common/posts/PostAuthor";
import Category from "../../common/posts/Category";
import DateOfPost from "../../common/posts/DateOfPost";
import Title from "../../common/posts/Title";
import PostContent from "./PostContent";
import { selectPostById } from "./postsSlice";
import PostVotes from "./PostVotes";
import styles from "./styles/post.module.css";
import DeletePost from "./DeletePost";
import NumComments from "./NumComments";
import PostDeletedMessage from "../../common/posts/PostDeletedMessage";

const Post = ({ postId }) => {
    const post = useSelector((state) => selectPostById(state, postId));

    const [currentlyEditing, setCurrentlyEditing] = useState(false);

    const { userIdLoggedIn } = useContext(UserContext);

    let content;
    // This would happen if the post was deleted while viewing comments. In this case, we display a message saying the post
    // was deleted.
    if (!post) {
        content = <PostDeletedMessage />;
    } else {
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

        content = (
            <>
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
                <PostContent
                    currentlyEditing={currentlyEditing}
                    postId={postId}
                />
                {deleteButton}
                {editButton}
                <NumComments postId={postId} />
            </>
        );
    }

    return (
        <div className={styles["post"]}>
            {content}
        </div>
    );
};

export default Post;
