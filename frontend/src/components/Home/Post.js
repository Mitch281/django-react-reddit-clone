import Category from "./Category";
import PostContent from "./PostContent";
import PostVotes from "./PostVotes";
import Title from "./Title";

const Post = (props) => {
    const votes = {
        numUpvotes: props.numUpvotes,
        numDownvotes: props.numDownvotes
    }

    return (
        <div className="post">
            <PostVotes votes={votes} />
            <Category categoryName={props.categoryName} />
            <Title title={props.title} />
            <PostContent content={props.content} />
        </div>
    )
}

export default Post
