import { useContext, useState } from "react";
import { UserContext } from "../../App";
import Category from "./Category";
import DateOfPost from "./DateOfPost";
import PostContent from "./PostContent";
import PostVotes from "./PostVotes";
import Title from "./Title";
import User from "./User";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ViewComments from "./ViewComments";
import DeletePost from "./DeletePost";

const Post = (props) => {

    const [currentlyEditing, setCurrentlyEditing] = useState(false);

    const votes = {
        numUpvotes: props.numUpvotes,
        numDownvotes: props.numDownvotes
    }

    let navigate = useNavigate();

    const { userIdLoggedIn } = useContext(UserContext);

    // Show comments of post.
    function navigateToPost(postId)  {
        navigate(`/post=${postId}/comments/`, {state: {
            votes: votes,
            categoryName: props.categoryName,
            username: props.username,
            dateCreated: props.dateCreated,
            title: props.title,
            content: props.content,
            categoryId: props.categoryId
        }});
    }

    function toggleCurrentlyEditing() {
        setCurrentlyEditing(currentlyEditing => !currentlyEditing);
    }

    return (
        <div className="post">
            <div className="top-post-flex-container">
                <PostVotes 
                votes={votes} 
                upvote={props.upvote} 
                postId={props.id} 
                userPostVotes={props.userPostVotes}
                trackUsersUpvotes={props.trackUsersUpvotes}
                downvote={props.downvote}
                trackUsersDownvotes={props.trackUsersDownvotes} 
                />
                <div className="post-info">
                    <Category categoryId={props.categoryId} categoryName={props.categoryName} />
                    <User username={props.username} />
                    <DateOfPost dateCreated={props.dateCreated} />
                </div>
            </div>
            <Title title={props.title} />
            <PostContent 
                content={props.content} 
                currentlyEditing={currentlyEditing} 
                userId={props.userId} 
                postId={props.id}
                editPostContent={props.editPostContent} 
                toggleCurrentlyEditing={toggleCurrentlyEditing}
            />
            <ViewComments postId={props.id} navigateToPost={navigateToPost} />
            {userIdLoggedIn === props.userId ? <DeletePost 
                                                    postId={props.id} 
                                                    userId={props.userId}
                                                    deletePost={props.deletePost}
                                                /> 
            : ""}
            {userIdLoggedIn === props.userId ? 
            <button type="button" className="toggle-edit-post" onClick={() => setCurrentlyEditing(!currentlyEditing)}>
                Edit
            </button> : ""}
        </div>
    )
}

Post.propTypes = {
    id : PropTypes.string,
    username : PropTypes.string,
    userId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    categoryId : PropTypes.string,
    categoryName : PropTypes.string,
    title : PropTypes.string,
    content : PropTypes.string,
    numUpvotes : PropTypes.number,
    numDownvotes : PropTypes.number,
    dateCreated : PropTypes.string,
    upvote: PropTypes.func,
    trackUsersUpvotes: PropTypes.func,
    userPostVotes: PropTypes.array,
    downvote: PropTypes.func,
    trackUsersDownvotes: PropTypes.func,
    editPostContent: PropTypes.func
}

export default Post
