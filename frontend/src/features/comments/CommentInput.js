import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { UserContext } from "../../App";
import { constants } from "../../constants";
import styles from "./styles/comment-input.module.css";
import { v4 as uuid_v4 } from "uuid";
import { makeCommentOnPost } from "./commentsSlice";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CommentInput = () => {
    const [commentContent, setCommentContent] = useState("");

    const dispatch = useDispatch();
    const addNewCommentStatus = useSelector(
        (state) => state.comments.makeCommentOnPostStatus
    );

    const { loggedIn, usernameLoggedIn, userIdLoggedIn } =
        useContext(UserContext);

    const { postId } = useParams();

    let submitButton;
    if (addNewCommentStatus === "pending") {
        submitButton = (
            <ClipLoader
                color={constants.loaderColour}
                loading={true}
                size={20}
                css={"margin-top: 10px"}
            />
        );
    } else {
        submitButton = <input type="submit" value="Comment" />;
    }

    async function addNewComment(e) {
        e.preventDefault();
        const newComment = {
            id: uuid_v4(),
            username: usernameLoggedIn,
            user: userIdLoggedIn,
            parent_post: postId,
            content: commentContent,
            num_upvotes: 0,
            num_downvotes: 0,
            date_created: new Date().toString(),
            parent_comment: null,
            hidden: false,
            num_replies: 0
        };

        try {
            await dispatch(makeCommentOnPost(newComment)).unwrap();
            setCommentContent("");
            toast.success("Comment successful!", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            toast.error("Could not make comment!", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    let content;
    if (loggedIn) {
        content = (
            <div id={styles["comment-input-flex-container"]}>
                <div id={styles["comment-input"]}>
                    <span>Commenting as {usernameLoggedIn}</span>
                    <form onSubmit={addNewComment}>
                        <textarea
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                        />
                        {submitButton}
                    </form>
                </div>
            </div>
        );
    } else {
        content = (
            <div
                id={styles["comment-not-logged-in-flex-container"]}
                className={styles["not-logged-in-message-flex-container"]}
            >
                <div
                    id={styles["comment-not-logged-in"]}
                    className={styles["not-logged-in-message"]}
                >
                    <span>Log in or signup to leave a comment &nbsp;</span>
                    <Link to="/login/">Login</Link>
                    &nbsp;
                    <Link to="/signup/">Signup</Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {content}
            <ToastContainer />
        </>
    );
};

export default CommentInput;
