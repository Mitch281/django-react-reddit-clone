import { useState, useContext } from "react";
import { UserContext } from "../../App";
import PropTypes from "prop-types";
import { getNewAccessTokenIfExpired } from "../../utils/auth";

const PostContent = (props) => {


    const [postContent, setPostContent] = useState(props.content);

    const { userIdLoggedIn } = useContext(UserContext);

    async function handleEditPostContent(e) {
        e.preventDefault();

        if (props.userId !== userIdLoggedIn) {
            alert("You do not have permission to edit this post as you did not create it!");
            return;
        } 

        const accessToken = localStorage.getItem("accessToken");
        const gotNewAccessToken = getNewAccessTokenIfExpired(accessToken);

        if (gotNewAccessToken) {
            const response = await fetch(`http://localhost:8000/api/post/id=${props.postId}/user-id=${userIdLoggedIn}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({content: postContent})
            });
            if (response.ok) {
                props.editPostContent(props.postId, postContent);
            } else {
                throw new Error("Couldn't edit post!");
            }
        }
        else {
            throw new Error("Couldn't fetch new access token!");
        }
    }

    function getOutput() {
        if (props.currentlyEditing) {
            return(
                <form className="edit-post-content" onSubmit={handleEditPostContent} >
                    <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} />
                    <input type="submit" value="Edit" />
                </form>
            );
        }

        return (
            <p className="post-content">
                {props.content}
            </p>
        );
    }

    return (
        getOutput()
    )
}

PostContent.propTypes = {
    content: PropTypes.string,
    currentlyEditing: PropTypes.bool,
    postId: PropTypes.string,
    userId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    editPostContent: PropTypes.func
}

export default PostContent
