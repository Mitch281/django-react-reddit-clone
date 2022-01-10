import Category from "./Category";
import DateOfPost from "./DateOfPost";
import PostContent from "./PostContent";
import PostVotes from "./PostVotes";
import Title from "./Title";
import User from "./User";

const Post = (props) => {
    const votes = {
        numUpvotes: props.numUpvotes,
        numDownvotes: props.numDownvotes
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
        </div>
    )
}

export default Post
