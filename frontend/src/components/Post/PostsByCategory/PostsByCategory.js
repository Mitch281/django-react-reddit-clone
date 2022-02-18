
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../App";
import { useLocation, useParams } from "react-router-dom";
import Post from "../Post/Post";
import PropTypes from "prop-types";
import OrderOptions from "../OrderOptions/OrderOptions";
import styles from "../Posts/posts.module.css";

const PostsByCategory = (props) => {
    const { reLogin } = useContext(UserContext);

    const params = useParams();
    const categoryName = params.categoryName;
    const order = params.order;

    const { state } = useLocation();
    const categoryId = state.categoryId;

    const [posts, setPosts] = useState([]);

    async function loadPostsByCategory(order) {
        let url;
        if (order) {
            url = `http://localhost:8000/api/posts/category=${categoryId}/${order}/`;
        } else {
            url = `http://localhost:8000/api/posts/category=${categoryId}/`;
        }
        const response = await fetch(url);
        if (response.ok) {
            const json = await response.json();
            setPosts(json);
        } else {
            throw new Error(response.status);
        }
    }

    useEffect(() => {
        reLogin()
    }, []);

    useEffect(() => {
        loadPostsByCategory(order)
        .catch(error => console.log(error));
    }, [params]);

    return (
        <>
            <h1 id={styles["category-name-top-page"]}>{categoryName}</h1>
            <OrderOptions />
            <div className={styles["posts"]}>
            {posts.map((post) => <Post 
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
                userPostVotes={props.userPostVotes}
                trackUsersUpvotes={props.trackUsersUpvotes}
                downvote={props.downvote}
                trackUsersDownvotes={props.trackUsersDownvotes}
                deletePost={props.deletePost}
                editPostContent={props.editPostContent}
            />
            )}
            </div>
        </>
    )
}

PostsByCategory.propTypes = {
    upvote: PropTypes.func,
    userPostVotes: PropTypes.array,
    trackUsersUpvotes: PropTypes.func,
    downvote: PropTypes.func,
    trackUsersDownvotes: PropTypes.func,
    deletePost: PropTypes.func,
    editPostContent: PropTypes.func,
}

export default PostsByCategory