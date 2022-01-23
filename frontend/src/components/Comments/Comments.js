import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import Comment from "./Comment";
import "../../style/comments.css";

const Comments = () => {

    const params = useParams();
    const postId = params.postId;

    const [comments, setComments] = useState([]);

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


    return (
        <div id="comments-flex-container">
            <div id="comments">
                {comments.map((comment) =>
                    <Comment
                        key={comment.id}
                        id={comment.id}
                        username={comment.username}
                        content={comment.content}
                        numUpvotes={comment.num_upvotes}
                        numDownvotes={comment.num_downvotes}
                        dateCreated={comment.date_created}
                    />
                )}
            </div>
        </div>
    )
}

export default Comments
