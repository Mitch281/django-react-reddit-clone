import { useEffect } from "react";
import Post from "./Post";

const Posts = (props) => {
    
    return (
        <div id="posts">
            {props.posts.map((post) => <Post 
            key={post.id}
            category_id={post.category}
            title={post.title}
            content={post.content}
            numUpvotes={post.num_upovotes}
            numDownvotes={post.num_downvotes}
            />)
            }
        </div>
    )
}

export default Posts
