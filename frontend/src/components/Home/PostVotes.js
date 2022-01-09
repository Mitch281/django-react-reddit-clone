const PostVotes = (props) => {
    const numUpvotes = props.votes.numUpvotes;
    const numDownvotes = props.votes.numDownvotes;

    return (
        <div className="post-votes">
            <button className="upvote">Up</button>
            <span className="vote-count">{numUpvotes - numDownvotes}</span>
            <button className="downvote">Down</button>
        </div>
    )
}

export default PostVotes
