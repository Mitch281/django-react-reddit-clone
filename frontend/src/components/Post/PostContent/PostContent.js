import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../App";
import PropTypes from "prop-types";
import styles from "./post-content.module.css";
import { editPost } from "../../../utils/fetch-data";

const PostContent = (props) => {

    const [postContent, setPostContent] = useState(props.content);

    /* This is needed for when the user looks at the comments of the post (i.e. we get to the Post component from the 
    PostSelected component). This is because on first render, postContent is undefined while on second render, it 
    is props.content. Thus, we need a useEffect to set the post content to props.content after second render. Note that
    when user views posts by category or posts on home page, this useEffect hook is not needed. */
    useEffect(() => {
        if (props.content) {
            setPostContent(props.content);
        }
    }, [props.content]);

    const { userIdLoggedIn } = useContext(UserContext);

    async function handleEditPostContent() {
        try {
            await editPost(postContent, props.postId, userIdLoggedIn);
            props.editPostContent(props.postId, postContent);
            props.toggleCurrentlyEditing();
        } catch(error) {
            throw error;
        }
    }

    function performEditPostContent(e) {
        e.preventDefault();

        if (props.userId !== userIdLoggedIn) {
            alert("You do not have permission to edit this post as you did not create it!");
            return;
        } 

        handleEditPostContent()
        .catch(error => console.log(error));
    }

    return (
        <>
            {props.currentlyEditing ? 
                <form className={styles["edit-post-content-form"]} onSubmit={performEditPostContent} >
                    <div>
                        <span>Edit Post</span>
                        <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} />
                        <input type="submit" value="Edit" />
                    </div>
                </form>
                : 
                <p className={styles["post-content"]}>
                    {props.content}
                </p>
            }
        </>
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
    editPostContent: PropTypes.func,
    toggleCurrentlyEditing: PropTypes.func
}

export default PostContent
