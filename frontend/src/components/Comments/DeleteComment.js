// Note that unlike posts, we do not actually perform a complete delete of comments. This is because this would ruin the
// structure of our comment chains. Instead, we will just set the user who made the comment to null and set the content
// of the comment to deleted.

import { useContext } from "react";
import { UserContext } from "../../App";
import { BsFillTrashFill } from "react-icons/bs";
import PropTypes from "prop-types";
import { getNewAccessTokenIfExpired } from "../../utils/auth";

const DeleteComment = (props) => {

    const { userIdLoggedIn } = useContext(UserContext);

    // async function handleDeleteComment() {

    //     const accessToken = localStorage.getItem("accessToken");
    //     try {
    //         getNewAccessTokenIfExpired(accessToken);
    //     } catch(error) {
    //         throw error;
    //     }

    //     const response = await fetch(`http://localhost:8000/api/comment/id=${props.commentId}/user-id=${userIdLoggedIn}/`, {
    //         method: "PATCH",
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    //         },
    //         body: JSON.stringify({username: null, content: null, user: null})
    //     });
    //     if (response.ok) {
    //         props.deleteComment(props.commentId)
    //     } else {
    //         throw new Error(response.status);
    //     }
    // }

    function performDeleteComment() {
        // handleDeleteComment()
        // .catch(error => console.log(error));
    }

    return (
        <BsFillTrashFill className="delete-comment" onClick={performDeleteComment} />
    );
}

DeleteComment.propTypes = {
    editComment: PropTypes.func,
    commentId: PropTypes.string,
    userId: PropTypes.string
}

export default DeleteComment