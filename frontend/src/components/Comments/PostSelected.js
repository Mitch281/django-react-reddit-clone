import { useLocation, useParams } from "react-router-dom";
import Post from "../Home/Post";

const PostSelected = () => {

    const { state } = useLocation();
    const params = useParams();
    const postId = params.postId;

    console.log(state);
    console.log(postId);

    return (
        <Post 
            key={postId}
            id={postId}
            username={state.username}
            categoryId={state.categoryId}
            categoryName={state.categoryName}
            title={state.title}
            content={state.content}
            numUpvotes={state.votes.numUpvotes}
            numDownvotes={state.votes.numDownvotes}
            dateCreated={state.dateCreated}
            />
    )
}

export default PostSelected

// votes: votes,
// categoryName: props.categoryName,
// username: props.username,
// dateCreated: props.dateCreated,
// title: props.title,
// content: props.content
