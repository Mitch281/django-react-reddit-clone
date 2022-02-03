import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import Comment from "./Comment";
import "../../style/comments.css";
import CommentInput from "./CommentInput";

const Comments = () => {

    const params = useParams();
    const postId = params.postId;

    const [comments, setComments] = useState([]);
    const [commentsClone, setCommentsClone] = useState([]);
    const [idMapping, setIdMapping] = useState({});
    
    const [commentChain, setCommentChain] = useState([]);

    // Reset the comment chain whenever our comments update. This is necessary because when a user replies to a comment or makes
    // a comment, Comments rerenders but state does not refresh (as opposed to a page refresh where state does reset). Thus,
    // we do not want to append to commentChain, but make the new comment chain using our new comments state.
    useEffect(() => {
        setCommentChain([]);

        // Here, we create a deep copy of comments so that when we create our recursive JSON comment chain, we do not change
        // comments when adding replies.
        setCommentsClone(JSON.parse(JSON.stringify(comments)));
    }, [comments]);

    async function loadComments() {
        const response = await fetch(`http://localhost:8000/api/comments/post=${postId}`);
        if (response.ok) {
            const json = await response.json();
            setComments(json);
        } else {
            throw new Error("couldn't fetch comments.");
        }
    }

    useEffect(() => {
        loadComments();
    }, [params]);

    useEffect(() => {
        if (comments.length !== 0) {
            // This maps the comment ids to the index it shows up in comments.
            setIdMapping(comments.reduce((accumulator, comment, i) => {
                accumulator[comment.id] = i;
                return accumulator;
            }, {}));
        }
    }, [comments]);

    useEffect(() => {
        if (Object.keys(idMapping).length !== 0 && commentsClone.length !== 0) {
            commentsClone.map((comment) => {

                // Nesting level will never change so do not need to worry about it changing comments array.
                const nestingLevel = getNestingLevel(comment, 0);
                comment.nestingLevel = nestingLevel;

                if (comment.parent_comment === null) {
                    setCommentChain(commentChain => [...commentChain, comment]);
                    return;
                }

                // Use mapping to locate parent of comment (our loop variable) in the comments array.
                const parentComment = commentsClone[idMapping[comment.parent_comment]];

                parentComment.replies = [...(parentComment.replies || []), comment];
            });
        }
    }, [idMapping, commentsClone]);

    function getNestingLevel(comment, nestingLevel) {

        // Note that comment.parent_comment is simply the id of the parent comment due to the django naming (maybe look into 
        // changing this in future to parent_comment_id), while parentComment is the actual parent comment object. Same thing
        // in above function.
        if (comment.parent_comment) {
            const parentComment = comments[idMapping[comment.parent_comment]];
            return getNestingLevel(parentComment, nestingLevel + 1);
        }
        return nestingLevel;
    }

    // Updates comments on frontend after post is successful on backend.
    function updateComments(newComment) {
        setComments(comments => [...comments, newComment]);
    }
    
    return (
        <>
            <CommentInput updateComments={updateComments}/>
            <div id="comments-flex-container">
                <div id="comments">
                    {commentChain.map((comment) =>
                        <Comment
                            key={comment.id}
                            id={comment.id}
                            username={comment.username}
                            content={comment.content}
                            numUpvotes={comment.num_upvotes}
                            numDownvotes={comment.num_downvotes}
                            dateCreated={comment.date_created}
                            replies={comment.replies}
                            nestingLevel={comment.nestingLevel}
                            updateComments={updateComments}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default Comments
