import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import Comment from "../Comment/Comment";
import CommentInput from "../CommentInput/CommentInput";
import { 
    postUpvote, 
    patchUsersUpvote, 
    postUsersUpvote, 
    postDownvote,  
    patchUsersDownvote, 
    postUsersDownvote, 
    fetchUsersVotesOnComments,
    fetchComments
} 
from "../../../utils/fetch-data";
import styles from "./comments.module.css";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import ClipLoader from "react-spinners/ClipLoader";
import {constants} from "../../../constants";
import OrderOptions from "../../OrderOptions/OrderOptions";

const Comments = () => {

    const params = useParams();
    const postId = params.postId;
    const order = params.order;

    const [comments, setComments] = useState([]);
    const [commentChain, setCommentChain] = useState([]);

    // This keeps track of all votes a user has voted on. This is needed so that users cannot vote twice on a post, and
    // to provide visual indication of what votes a user has voted on.
    const [userCommentVotes, setUserCommentVotes] = useState([]);

    const [error, setError] = useState();
    
    const [commentsLoading, setCommentsLoading] = useState(false);

    async function loadUserCommentVotes() {
        try {
            const json = await fetchUsersVotesOnComments();
            setUserCommentVotes(json);
        } catch(error) {
            throw error;
        }
    }

    useEffect(() => {
        loadUserCommentVotes();
    }, []);

    useEffect(() => {
        async function loadComments(order) {
            setCommentsLoading(true);
            try {
                const json = await fetchComments(order, postId);
                setComments(json);
            } catch(error) {
                setError(error);
            } finally {
                setCommentsLoading(false);
            }
        }

        loadComments();
    }, [postId, order]);

    useEffect(() => {
        if (comments.length !== 0) {
            setCommentChain(nestComments());
        }
        // eslint-disable-next-line
    }, [comments, params]);

    function nestComments() {
        const commentMap = {};
        const commentsClone = JSON.parse(JSON.stringify(comments));

        commentsClone.forEach(comment => commentMap[comment.id] = comment);

        commentsClone.forEach(comment => {
            comment.nestingLevel = getNestingLevel(comment, commentMap, 0);
            if (comment.parent_comment) {
                const parentComment = commentMap[comment.parent_comment];
                parentComment.replies = [...(parentComment.replies || []), comment];
            }
        });

        // Only return the root level comments.
        return commentsClone.filter(comment => !comment.parent_comment);
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

    // Updates comments on frontend after post is successful on backend.
    function updateComments(newComment) {
        setComments(comments => [...comments, newComment]);
    }

    async function upvote(commentId, currentNumUpvotes, currentNumDownvotes, status, thingToUpvote) {
        try {
            await postUpvote(commentId, currentNumUpvotes, currentNumDownvotes, status, thingToUpvote);
            // User is going from downvote to upvote.
            if (status === "downvoted") {
                setComments(comments.map(comment => 
                    comment.id === commentId ? {...comment, num_upvotes: currentNumUpvotes + 1, num_downvotes: currentNumDownvotes - 1} : comment
                ));
            }

            // User is undoing upvote.
            else if (status === "upvoted") {
                setComments(comments.map(comment => 
                    comment.id === commentId ? {...comment, num_upvotes: currentNumUpvotes - 1} : comment
                ));
            } 

            // User is going from no vote to upvote.
            else {
                setComments(comments.map(comment => 
                    comment.id === commentId ? {...comment, num_upvotes: currentNumUpvotes + 1} : comment
                ));
            }
        } catch(error) {
            throw error;
        }
    }

    async function trackUsersUpvotes(userId, commentId, status, commentVoteId, thingToUpvote) {
        
        // User has voted on post already. Thus, commentVodeId exists (is not null).
        if (commentVoteId) {
            try {
                await patchUsersUpvote(status, commentVoteId, thingToUpvote);
                // User is going from downvote to upvote
                if (status === "downvoted") {
                    setUserCommentVotes(userCommentVotes.map(userCommentVote => 
                        userCommentVote.id === commentVoteId ? {...userCommentVote, upvote: true, downvote: false} : userCommentVote
                    ));
                }

                // User is undoing upvote
                else if (status === "upvoted") {
                    setUserCommentVotes(userCommentVotes.map(userCommentVote => 
                        userCommentVote.id === commentVoteId ? {...userCommentVote, upvote:false} : userCommentVote
                    ));
                }

                // User has previously voted before, but has no current vote on the comment.
                else {
                    setUserCommentVotes(userCommentVotes.map(userCommentVote =>
                        userCommentVote.id === commentVoteId ? {...userCommentVote, upvote: true} : userCommentVote
                    ));
                }
            } catch (error) {
                throw error;
            }
        } 
        
        // The user has not voted on the comment yet. Thus, we need to post a new vote.
        else {
            try {
                const data = await postUsersUpvote(userId, commentId, thingToUpvote);
                setUserCommentVotes(userCommentVotes => [...userCommentVotes, data]);
            } catch (error) {
                throw error;
            }
        }
    }

    async function downvote(commentId, currentNumUpvotes, currentNumDownvotes, status, thingToDownvote) {
        try {
            await postDownvote(commentId, currentNumUpvotes, currentNumDownvotes, status, thingToDownvote);
            // User is undoing downvote by downvoting again.
          if (status === "downvoted") {
            setComments(comments.map(comment => 
              comment.id === commentId ? {...comment, num_downvotes: currentNumDownvotes - 1}: comment));
          }
    
          // User is going from upvote to downvote
          else if (status === "upvoted") {
            setComments(comments.map(comment =>
              comment.id === commentId ? {...comment, num_upvotes: currentNumUpvotes - 1, num_downvotes: currentNumDownvotes + 1} : comment));
          }
    
          // User is going from no vote to downote.
          else {
            setComments(comments.map(comment =>
              comment.id === commentId ? {...comment, num_downvotes: currentNumDownvotes + 1} : comment));
          }
        } catch(error) {
            throw error;
        }
    }

    async function trackUsersDownvotes(userId, commentId, status, commentVoteId, thingToDownvote) {

        // User has voted on the post before.
        if (commentVoteId) {
            try {
                await patchUsersDownvote(status, commentVoteId, thingToDownvote);

                // User is undoing downvote by downvoting again.
                if (status === "downvoted") {
                    setUserCommentVotes(userCommentVotes.map(userCommentVote => 
                        userCommentVote.id === commentVoteId ? {...userCommentVote, downvote: false} : userCommentVote
                    ));
                }

                // User is going from upvote to downvote
                else if (status === "upvoted") {
                    setUserCommentVotes(userCommentVotes.map(userCommentVote => 
                        userCommentVote.id === commentVoteId ? {...userCommentVote, upvote: false, downvote: true} : userCommentVote
                    ));
                }

                // User has previously voted before, but has no current vote on the post.
                else {
                    setUserCommentVotes(userCommentVotes.map(userCommentVote => 
                        userCommentVote.id === commentVoteId ? {...userCommentVote, downvote: true} : userCommentVote
                    ));
                }
            } catch(error) {
                throw error;
            }
        }

        // User has not voted on comment yet.
        else {
            try {
                const data = await postUsersDownvote(userId, commentId, thingToDownvote);
                setUserCommentVotes(userCommentVotes => [...userCommentVotes, data]);
            } catch(error) {
                throw error;
            }
        }
    }


    function editComment(commentId, newCommentContent) {
        setComments(comments.map(comment => 
            comment.id === commentId ? {...comment, content: newCommentContent} : comment));
    }

    // Don't necessarily need this function, but we will call it anyway to trigger a rerender as well as for the 
    // sake of consistency.
    function deleteComment(commentId) {
        setComments(comments.map(comment => 
            comment.id === commentId ? {...comment, deleted: true, content: null, user: null} : comment));
    }

    function toggleHidden(commentId, currentHidden) {
        setComments(comments.map(comment => 
            comment.id === commentId ? {...comment, hidden: !currentHidden}: comment));
    }

    function getOutput() {
        if (error) {
            return (
                <div id={styles["comments-flex-container"]}>
                    <ErrorMessage errorMessage={"Could not load comments. Please try again later."} />
                </div>
            );
        }
        else if (commentsLoading) {
            return (
                <div id={styles["comments-flex-container"]}>
                    <ClipLoader css={"margin-top: 50px"} color={constants.loaderColour} loading={true} size={150}/>
                </div>
            );
        }
        return (
            <>
                <CommentInput updateComments={updateComments}/>
                <OrderOptions orderingType="comments" />
                <div id={styles["comments-flex-container"]}>
                    <div id={styles["comments"]}>
                        {commentChain.map((comment) =>
                            <Comment
                                key={comment.id}
                                id={comment.id}
                                userId={comment.user}
                                username={comment.username}
                                content={comment.content}
                                numUpvotes={comment.num_upvotes}
                                numDownvotes={comment.num_downvotes}
                                dateCreated={comment.date_created}
                                replies={comment.replies}
                                nestingLevel={comment.nestingLevel}
                                deleted={comment.deleted}
                                numReplies={comment.num_replies}
                                hidden={comment.hidden}
                                updateComments={updateComments}
                                userCommentVotes={userCommentVotes}
                                upvote={upvote}
                                downvote={downvote}
                                trackUsersUpvotes={trackUsersUpvotes}
                                trackUsersDownvotes={trackUsersDownvotes}
                                editComment={editComment}
                                deleteComment={deleteComment}
                                toggleHidden={toggleHidden}
                                isRootComment={true}
                            />
                        )}
                    </div>
                </div>
            </>
        );
    }
    
    return (
        getOutput()
    );
}

export default Comments
