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
        props.loadPosts(order)
        .catch(error => console.log(error));
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
                userId={post.user}
                categoryId={post.category}
                categoryName={post.category_name}
                title={post.title}
                content={post.content}
                numUpvotes={post.num_upvotes}
                numDownvotes={post.num_downvotes}
                dateCreated={post.date_created}
                upvote={props.upvote}
                trackUsersUpvotes={props.trackUsersUpvotes}
                userPostVotes={props.userPostVotes}
                downvote={props.downvote}
                trackUsersDownvotes={props.trackUsersDownvotes}
                deletePost={props.deletePost}
                editPostContent={props.editPostContent}
            />
            )
            }
            </div>
        </>
    )
}

Post.propTypes = {
    posts: PropTypes.object,
    upvote: PropTypes.func,
    trackUsersUpvotes: PropTypes.func,
    userPostVotes: PropTypes.array,
    downvote : PropTypes.func,
    trackUsersDownvotes : PropTypes.func,
    deletePost: PropTypes.func,
    editPostContent: PropTypes.func
}

export default Posts


