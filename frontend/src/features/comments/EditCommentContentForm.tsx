import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../app/App";
import { AppDispatch, RootState } from "../../app/store";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import Textarea from "../../components/Textarea/Textarea";
import { Comment, EditCommentPayload } from "../../types/shared";
import { renderErrorOnRequest } from "../../utils/auth";
import { constants } from "../../utils/constants";
import { editComment, selectCommentById } from "./commentsSlice";
import styles from "./styles/comment-content.module.css";

type Props = {
    commentId: string;
    toggleEditForm: () => void;
};

const EditCommentContentForm = ({ commentId, toggleEditForm }: Props) => {
    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();
    const comment = useSelector((state: RootState) =>
        selectCommentById(state, commentId)
    ) as Comment;

    const [commentContent, setCommentContent] = useState(comment.content);
    const [editCommentStatus, setEditCommentStatus] = useState<
        "pending" | "idle" | "fulfilled"
    >("idle");

    const { userIdLoggedIn, logout } = useContext(UserContext);

    let numCommentContentCharsLeft =
        constants.COMMENT_CONTENT_CHAR_LIMIT - commentContent.length;

    async function handleEditCommentContent(e: React.FormEvent) {
        e.preventDefault();
        const editCommentInformation: EditCommentPayload = {
            userId: parseInt(userIdLoggedIn),
            newCommentContent: commentContent,
            commentId: commentId,
        };

        setEditCommentStatus("pending");

        try {
            await dispatch(editComment(editCommentInformation)).unwrap();
            toggleEditForm();
            toast.success("Succesfully edited comment!", {
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

    return (
        <form
            className={styles["edit-comment-content-form"]}
            onSubmit={handleEditCommentContent}
        >
            <div>
                <span>Edit Comment</span>
                <Textarea
                    placeholder="Content"
                    value={commentContent}
                    onChangeHandler={(e) => setCommentContent(e.target.value)}
                    numCharsLeft={numCommentContentCharsLeft}
                />
                <SubmitButton
                    value="Edit"
                    apiRequestStatus={editCommentStatus}
                    isDisabled={numCommentContentCharsLeft < 0}
                />
            </div>
        </form>
    );
};

export default EditCommentContentForm;
