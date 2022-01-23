import Category from "./Category";
import DateOfPost from "./DateOfPost";
import PostContent from "./PostContent";
import PostVotes from "./PostVotes";
import Title from "./Title";
import User from "./User";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { BiCommentDetail } from "react-icons/bi";
import { useEffect, useState } from "react";

const Post = (props) => {

    const votes = {
        numUpvotes: props.numUpvotes,
        numDownvotes: props.numDownvotes
    }

    const [numComments, setNumComments] = useState();

    let navigate = useNavigate();

    // Show comments of post.
    function navigateToPost()  {
        navigate(`/post=${props.id}/comments/`, {state: {
            votes: votes,
            categoryName: props.categoryName,
            username: props.username,
            dateCreated: props.dateCreated,
            title: props.title,
            content: props.content,
            categoryId: props.categoryId
        }});
    }

    async function getNumberOfComments() {
        const response = await fetch(`http://localhost:8000/api/post/num-comments/id=${props.id}/`);
        if (response.ok) {
            const json = await response.json();
            setNumComments(json.num_comments);
        } else {
            throw new Error ("Couldn't get number of comments!");
        }
    }

    useEffect(() => {
        getNumberOfComments();
    }, []);

    return (
        <div className="post">
            <div className="top-post-flex-container">
                <PostVotes votes={votes} 
                upvote={props.upvote} 
                postId={props.id} 
                userPostVotes={props.userPostVotes}
                userPostUpvote={props.userPostUpvote}
                downvote={props.downvote}
                userPostDownvote={props.userPostDownvote} 
                />
                <div className="post-info">
                    <Category categoryId={props.categoryId} categoryName={props.categoryName} />
                    <User username={props.username} />
                    <DateOfPost dateCreated={props.dateCreated} />
                </div>
            </div>
            <Title title={props.title} />
            <PostContent content={props.content} />
            <div className="nav-to-comments" onClick={navigateToPost}>
                <BiCommentDetail />
                <span>{numComments} Comments</span>
            </div>
        </div>
    )
}

Post.propTypes = {
    id : PropTypes.string,
    username : PropTypes.string,
    categoryId : PropTypes.string,
    categoryName : PropTypes.string,
    title : PropTypes.string,
    content : PropTypes.string,
    numUpvotes : PropTypes.number,
    numDownvotes : PropTypes.number,
    dateCreated : PropTypes.string,
    upvote: PropTypes.func,
    userPostUpvote: PropTypes.func,
    userPostVotes: PropTypes.array,
    downvote: PropTypes.func,
    userPostDownvote: PropTypes.func
}

export default Post
