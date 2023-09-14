import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../app/App";
import useHandleTextInput from "../../hooks/useHandleTextInput";
import type { EditPostPayload, Post } from "../../types/shared";
import { renderErrorOnRequest } from "../../utils/auth";
import { constants } from "../../utils/constants";
import { editPost, selectPostById } from "./postsSlice";
import styles from "./styles/post-content.module.css";

type Props = {
    postId: string;
    currentlyEditing: boolean;
    toggleCurrentlyEditing: () => void;
};

const PostContent = ({
    postId,
    currentlyEditing,
    toggleCurrentlyEditing,
}: Props) => {
    const dispatch = useDispatch();
    const handleTextInput = useHandleTextInput();
    const post: Post = useSelector((state) =>
        selectPostById(state, postId)
    ) as Post;
    const [editPostStatus, setEditPostStatus] = useState("idle");
    const [postContent, setPostContent] = useState(post.content);

    const { userIdLoggedIn } = useContext(UserContext);

    let numContentCharsLeft =
        constants.POST_CONTENT_CHAR_LIMIT - postContent.length;

    async function handleEditPost(e: React.FormEvent) {
        e.preventDefault();
        setEditPostStatus("pending");

        const data: EditPostPayload = {
            postId: postId,
            userId: parseInt(userIdLoggedIn),
            newPostContent: postContent,
        };
        try {
            await dispatch(editPost(data)).unwrap();
            toggleCurrentlyEditing();
            toast.success("Succesfully edited post!", {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error: any) {
            renderErrorOnRequest(error as Error);
        } finally {
            setEditPostStatus("idle");
        }
    }

    useEffect(() => {
        if (editPostStatus === "fulfilled") {
            toast.success("Succesfully edited post!", {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, [editPostStatus]);

    let submitButton;
    if (editPostStatus === "pending") {
        submitButton = (
            <ClipLoader
                color={constants.loaderColour}
                loading={true}
                size={20}
                css={"margin-top: 10px"}
            />
        );
    } else {
        const disabled = numContentCharsLeft < 0;
        submitButton = <input type="submit" value="Edit" disabled={disabled} />;
    }

    let content;
    if (currentlyEditing) {
        content = (
            <form
                className={styles["edit-post-content-form"]}
                onSubmit={handleEditPost}
            >
                <div>
                    <span>Edit Post</span>
                    <textarea
                        value={postContent}
                        onChange={(e) =>
                            handleTextInput(
                                e,
                                setPostContent,
                                numContentCharsLeft
                            )
                        }
                    />
                    <span className={styles["char-count"]}>
                        {numContentCharsLeft} characters left
                    </span>
                    {submitButton}
                </div>
            </form>
        );
    } else {
        content = <p className={styles["post-content"]}>{post.content}</p>;
    }

    return <>{content}</>;
};

export default PostContent;
