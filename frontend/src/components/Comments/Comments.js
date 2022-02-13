import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import Comment from "./Comment";
import "../../style/comments.css";
import CommentInput from "./CommentInput";
import { 
    postUpvote, 
    patchUsersUpvote, 
    postUsersUpvote, 
    postDownvote,  
    patchUsersDownvote, 
    postUsersDownvote 
} 
from "../../utils/fetch-data";

const Comments = () => {

    const params = useParams();
    const postId = params.postId;

    const [comments, setComments] = useState([]);
    const [commentsClone, setCommentsClone] = useState([]);
    const [idMapping, setIdMapping] = useState({});
    
    const [commentChain, setCommentChain] = useState([]);

    // This keeps track of all votes a user has voted on. This is needed so that users cannot vote twice on a post, and
    // to provide visual indication of what votes a user has voted on.
    const [userCommentVotes, setUserCommentVotes] = useState([]);

    useEffect(() => {
        async function loadUserCommentVotes() {
            const response = await fetch("http://localhost:8000/api/comment-votes/");
            if (response.ok) {
                const json = await response.json();
                setUserCommentVotes(json)
            } else {
                throw new Error("Couldn't load user comment votes!");
            }
        }

        loadUserCommentVotes();
    }, []);

    // Reset the comment chain whenever our comments update. This is necessary because when a user replies to a comment or makes
    // a comment, Comments rerenders but state does not refresh (as opposed to a page refresh where state does reset). Thus,
    // we do not want to append to commentChain, but make the new comment chain using our new comments state.
    useEffect(() => {
        setCommentChain([]);

        // Here, we create a deep copy of comments so that when we create our recursive JSON comment chain, we do not change
        // comments when adding replies.
        setCommentsClone(JSON.parse(JSON.stringify(comments)));
    }, [comments, userCommentVotes]);

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
            comment.id === commentId ? {...comment, deleted: true} : comment));
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
                            userId={comment.user}
                            username={comment.username}
                            content={comment.content}
                            numUpvotes={comment.num_upvotes}
                            numDownvotes={comment.num_downvotes}
                            dateCreated={comment.date_created}
                            replies={comment.replies}
                            nestingLevel={comment.nestingLevel}
                            deleted={comment.deleted}
                            updateComments={updateComments}
                            userCommentVotes={userCommentVotes}
                            upvote={upvote}
                            downvote={downvote}
                            trackUsersUpvotes={trackUsersUpvotes}
                            trackUsersDownvotes={trackUsersDownvotes}
                            editComment={editComment}
                            deleteComment={deleteComment}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default Comments
