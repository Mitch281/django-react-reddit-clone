import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import type { Post as PostType } from "../../../types";
import { UserContext } from "../../app/App";
import Category from "./Category";
import DateOfPost from "./DateOfPost";
import DeletePost from "./DeletePost";
import NumComments from "./NumComments";
import PostAuthor from "./PostAuthor";
import PostContent from "./PostContent";
import PostDeletedMessage from "./PostDeletedMessage";
import PostVotes from "./PostVotes";
import Title from "./Title";
import { selectPostById } from "./postsSlice";
import styles from "./styles/post.module.css";

type Props = {
    postId: string;
};

const Post = ({ postId }: Props) => {
    const post: PostType = useSelector((state) =>
        selectPostById(state, postId)
    ) as PostType;

    const [currentlyEditing, setCurrentlyEditing] = useState(false);

    const { userIdLoggedIn } = useContext(UserContext);

    function toggleCurrentlyEditing() {
        setCurrentlyEditing(!currentlyEditing);
    }

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
                    onClick={toggleCurrentlyEditing}
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
                    toggleCurrentlyEditing={toggleCurrentlyEditing}
                />
                {deleteButton}
                {editButton}
                <NumComments postId={postId} />
            </>
        );
    }

    return <div className={styles["post"]}>{content}</div>;
};

export default Post;
