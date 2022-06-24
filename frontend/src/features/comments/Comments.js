import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Comment from "./Comment";
import CommentInput from "../../components/Comments/CommentInput/CommentInput";
import OrderOptions from "../../components/OrderOptions/OrderOptions";
import { constants } from "../../constants";
import { selectAllComments } from "./commentsSlice";
import styles from "./styles/comments.module.css";
import { fetchComments } from "./commentsSlice";

const Comments = () => {
    const params = useParams();
    const postId = params.postId;
    const order = params.order;

    const dispatch = useDispatch();
    const commentStatus = useSelector((state) => state.comments.status);
    const comments = useSelector(selectAllComments);

    const [commentChain, setCommentChain] = useState([]);

    useEffect(() => {
        dispatch(fetchComments({ order: order, postId: postId }));
    }, [order, dispatch]);

    // Once we fetch the comments, we will put them in their nested structure.
    useEffect(() => {
        const nestedComments = nestComments();
        setCommentChain(nestedComments);
    }, [comments]);

    function nestComments() {
        const commentMap = {};
        const commentsClone = JSON.parse(JSON.stringify(comments));

        commentsClone.forEach((comment) => (commentMap[comment.id] = comment));

        commentsClone.forEach((comment) => {
            comment.nestingLevel = getNestingLevel(comment, commentMap, 0);
            if (comment.parent_comment) {
                const parentComment = commentMap[comment.parent_comment];
                parentComment.replies = [
                    ...(parentComment.replies || []),
                    comment,
                ];
            }
        });

        // Only return the root level comments.
        return commentsClone.filter((comment) => !comment.parent_comment);
    }

    function getNestingLevel(comment, mapping, nestingLevel) {
        // Note that comment.parent_comment is simply the id of the parent comment due to the django naming (maybe look into
        // changing this in future to parent_comment_id), while parentComment is the actual parent comment object. Same thing
        // in above function.
        if (comment.parent_comment) {
            const parentComment = mapping[comment.parent_comment];
            return getNestingLevel(parentComment, mapping, nestingLevel + 1);
        }
        return nestingLevel;
    }

    let content;

    if (commentStatus === "rejected") {
        toast.error("Could not fetch comments!", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    } else if (commentStatus === "pending") {
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
    } else if (commentStatus === "fulfilled") {
        content = commentChain.map((comment) => (
            <Comment
                key={comment.id}
                commentId={comment.id}
                replies={comment.replies}
                isRootComment={true}
            />
        ));
    }

    return (
        <>
            <CommentInput />
            <OrderOptions orderingType="comments" />
            <div id={styles["comments-flex-container"]}>
                <div id={styles["comments"]}>{content}</div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Comments;
