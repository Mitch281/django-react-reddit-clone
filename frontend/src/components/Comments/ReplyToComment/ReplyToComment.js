import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { v4 as uuid_v4 } from "uuid";
import { UserContext } from "../../../App";
import { constants } from "../../../constants";
import { CantGetNewAccessTokenError } from "../../../utils/auth";
import { postReplyToComment } from "../../../utils/fetch-data";
import ErrorMessageModal from "../../ErrorMessage/ErrorMessageModal";
import styles from "./reply-to-comment.module.css";

const ReplyToComment = (props) => {
    const [replyContent, setReplyContent] = useState("");
    const { usernameLoggedIn, userIdLoggedIn } =
        useContext(UserContext);

    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const postId = params.postId;

    function getDisplay() {
        if (!props.wantReplyForm) {
            return { display: "none" };
        }
    }

    // TODO: data validation.
    async function postReply() {
        const dateNow = new Date().toString();

        const commentId = uuid_v4();
        const reply = {
            id: commentId,
            username: usernameLoggedIn,
            user: userIdLoggedIn,
            parent_post: postId,
            content: replyContent,
            num_upvotes: 0,
            num_downvotes: 0,
            date_created: dateNow,
            parent_comment: props.parentCommentId,
            hidden: false,
            num_replies: 0,
        };

        try {
            await postReplyToComment(reply);
            // Clear reply text box.
            setReplyContent("");

            props.toggleReplyForm();
            props.updateComments(reply);
        } catch (error) {
            throw error;
        }
    }

    async function performPostReply(e) {
        e.preventDefault();
        setLoading(true);

        try {
            await postReply();
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    function getErrorMessage() {
        
        // Controls how long to render error message for.
        setTimeout(() => {
            setError(null);
        }, constants.ERROR_MODAL_RENDER_TIME);

        if (error instanceof CantGetNewAccessTokenError) {
            return (
                <ErrorMessageModal errorMessage="Session expired. Please login again." />
            );
        }

        return (
            <ErrorMessageModal errorMessage="Could not reply to comment. Please try again later." />
        );
    }

    return (
        <>
            <div style={getDisplay()}>
                <form
                    className={styles["reply-to-comment-form"]}
                    onSubmit={performPostReply}
                >
                    <div>
                        <span>
                            Reply to {props.parentUsername} as{" "}
                            {usernameLoggedIn}
                        </span>
                        <textarea
                            type="text"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Content"
                        />
                        {loading ? (
                            <ClipLoader
                                color={constants.loaderColour}
                                loading={true}
                                size={20}
                                css={"margin-top: 10px"}
                            />
                        ) : (
                            <input type="submit" value="Reply" />
                        )}
                    </div>
                </form>
            </div>
            {error ? getErrorMessage() : ""}
        </>
    );
};

ReplyToComment.propTypes = {
    wantReplyForm: PropTypes.bool,
    parentCommentId: PropTypes.string,
    parentUsername: PropTypes.string,
    updateComments: PropTypes.func,
    togglyReplyForm: PropTypes.func,
};

export default ReplyToComment;
