import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuid_v4 } from "uuid";
import { UserContext } from "../../app/App";
import { AppDispatch, RootState } from "../../app/store";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import Textarea from "../../components/Textarea/Textarea";
import useHandleTextInput from "../../hooks/useHandleTextInput";
import { AddCommentReplyBody, Comment } from "../../types/shared";
import { renderErrorOnRequest } from "../../utils/auth";
import { constants } from "../../utils/constants";
import {
    incrementNumReplies,
    makeCommentOnPost,
    selectCommentById,
} from "./commentsSlice";
import styles from "./styles/reply-to-comment-form.module.css";

type Props = {
    commentId: string;
    toggleReplyForm: () => void;
};

const ReplyToCommentForm = ({ commentId, toggleReplyForm }: Props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const handleTextInput = useHandleTextInput();
    const commentToReplyTo = useSelector((state: RootState) =>
        selectCommentById(state, commentId)
    ) as Comment;
    const parentUsername = commentToReplyTo.username;

    const [replyContent, setReplyContent] = useState("");
    const [editCommentStatus, setEditCommentStatus] = useState<
        "idle" | "pending" | "fulfilled"
    >("idle");

    const { usernameLoggedIn, userIdLoggedIn, logout } =
        useContext(UserContext);

    let numReplyContentCharsLeft =
        constants.COMMENT_CONTENT_CHAR_LIMIT - replyContent.length;

    async function handleReplyComment(e: React.FormEvent) {
        e.preventDefault();

        const reply: AddCommentReplyBody = {
            id: uuid_v4(),
            username: usernameLoggedIn,
            user: parseInt(userIdLoggedIn),
            parent_post: commentToReplyTo.parent_post,
            content: replyContent,
            date_created: new Date().toString(),
            parent_comment: commentId,
            is_hidden: false,
            num_replies: 0,
        };

        setEditCommentStatus("pending");
        try {
            await dispatch(makeCommentOnPost(reply)).unwrap();
            dispatch(
                incrementNumReplies(commentId, commentToReplyTo.num_replies)
            );
            setReplyContent("");
            setEditCommentStatus("fulfilled");
            toggleReplyForm();
            toast.success("Comment successful!", {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            renderErrorOnRequest(error as Error, logout, navigate);
        } finally {
            setEditCommentStatus("idle");
        }
    }

    let content;

    content = (
        <div>
            <form
                className={styles["reply-to-comment-form"]}
                onSubmit={handleReplyComment}
            >
                <div>
                    <span>
                        Reply to {parentUsername} as {usernameLoggedIn}
                    </span>
                    <Textarea
                        placeholder="Content"
                        value={replyContent}
                        onChangeHandler={(e) =>
                            handleTextInput(
                                e,
                                setReplyContent,
                                numReplyContentCharsLeft
                            )
                        }
                        numCharsLeft={numReplyContentCharsLeft}
                    />
                    <SubmitButton
                        value="Reply"
                        apiRequestStatus={editCommentStatus}
                        isDisabled={numReplyContentCharsLeft < 0}
                    />
                </div>
            </form>
        </div>
    );

    return content;
};

export default ReplyToCommentForm;
