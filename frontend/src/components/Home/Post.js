import Category from "./Category";
import DateOfPost from "./DateOfPost";
import PostContent from "./PostContent";
import PostVotes from "./PostVotes";
import Title from "./Title";
import User from "./User";
import { useNavigate } from "react-router-dom";

const Post = (props) => {

    const votes = {
        numUpvotes: props.numUpvotes,
        numDownvotes: props.numDownvotes
    }

    let navigate = useNavigate();

    // Show comments of post.
    function navigateToPost()  {
        navigate(`/post=${props.id}/comments/`, {replace: true, state: {
            votes: votes,
            categoryName: props.categoryName,
            username: props.username,
            dateCreated: props.dateCreated,
            title: props.title,
            content: props.content,
            categoryId: props.categoryId
        }});
    }

    return (
        <div className="post">
            <div className="top-post flex-container">
                <PostVotes votes={votes} />
                <div className="post-info">
                    <Category categoryName={props.categoryName} />
                    <User username={props.username} />
                    <DateOfPost dateCreated={props.dateCreated} />
                </div>
            </div>
            <Title title={props.title} />
            <PostContent content={props.content} />
            <button type="button" onClick={navigateToPost}>Comments</button>
        </div>
    )
}

export default Post
