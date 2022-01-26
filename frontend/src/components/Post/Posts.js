import { useParams } from "react-router-dom";
import Post from "./Post";
import "../../style/posts.css";
import PropTypes from "prop-types";
import OrderOptions from "./OrderOptions";
import { useEffect } from "react";

const Posts = (props) => {

    const params = useParams();
    const order = params.order;

    useEffect(() => {
        props.loadPosts(order);
    }, [order]);
    
    return (
        <>
            <h1 id="category-name-top-page">Home</h1>
            <OrderOptions />
            <div className="posts">
                {props.posts.map((post) => <Post 
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
                userPostUpvote={props.userPostUpvote}
                userPostVotes={props.userPostVotes}
                downvote={props.downvote}
                userPostDownvote={props.userPostDownvote}
            />)
            }
        </div>
        </>
    )
}

Post.propTypes = {
    posts: PropTypes.object,
    upvote: PropTypes.func,
    userPostUpvote: PropTypes.func,
    userPostVotes: PropTypes.array,
    downvote : PropTypes.func,
    userPostDownvote : PropTypes.func
}

export default Posts


