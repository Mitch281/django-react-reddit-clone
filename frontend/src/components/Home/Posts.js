import Post from "./Post";
import "../../style/posts.css";

const Posts = (props) => {
    
    return (
        <div id="posts">
            {props.posts.map((post) => <Post 
            key={post.id}
            categoryId={post.category}
            categoryName={post.category_name}
            title={post.title}
            content={post.content}
            numUpvotes={post.num_upvotes}
            numDownvotes={post.num_downvotes}
            />)
            }
        </div>
    )
}

export default Posts
