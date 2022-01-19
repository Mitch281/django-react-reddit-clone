import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useLocation, useParams } from "react-router-dom";
import Post from "../Home/Post";
import PropTypes from "prop-types";

const PostsByCategory = (props) => {
    const { reLogin } = useContext(UserContext);

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
        reLogin()
    }, []);

    useEffect(() => {
        loadPostsByCategory();
    }, [params]);

    return (
        <div className="posts">
            {posts.map((post) => <Post 
                key={post.id}
                id={post.id}
                username={post.username}
                categoryId={post.category}
                categoryName={post.category_name}
                title={post.title}
                content={post.content}
                numUpvotes={post.num_upvotes}
                numDownvotes={post.num_downvotes}
                dateCreated={post.date_created}
                upvote={props.upvote}
                userPostVotes={props.userPostVotes}
                userPostUpvote={props.userPostUpvote}
            />
            )}
        </div>
    )
}

PostsByCategory.propTypes = {
    upvote: PropTypes.func,
    userPostVotes: PropTypes.array,
    userPostUpvote: PropTypes.func
}

export default PostsByCategory
