import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Post from "../Home/Post";

const PostsByCategory = () => {
    const params = useParams();
    const categoryName = params.categoryName;

    const { state } = useLocation();
    const categoryId = state.categoryId;

    const [posts, setPosts] = useState([]);

    async function loadPostsByCategory() {
        const response = await fetch(`http://localhost:8000/api/posts/category=${categoryId}`);
        if (response.ok) {
            const json = await response.json();
            setPosts(json);
        } else {
            throw new Error("error loading posts by category");
        }
    }

    useEffect(() => {
        loadPostsByCategory();
    }, [params]);

    return (
        <div className="posts">
            {posts.map((post) => <Post 
            key={post.id}
                username={post.username}
                categoryId={post.category}
                categoryName={post.category_name}
                title={post.title}
                content={post.content}
                numUpvotes={post.num_upvotes}
                numDownvotes={post.num_downvotes}
                dateCreated={post.date_created}
            />
            )}
        </div>
    )
}

export default PostsByCategory
