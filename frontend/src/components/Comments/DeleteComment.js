import { useContext } from "react";
import { UserContext } from "../../App";
import { BsFillTrashFill } from "react-icons/bs";
import PropTypes from "prop-types";
import { getNewAccessTokenIfExpired } from "../../utils/auth";

const DeleteComment = (props) => {

    const { userIdLoggedIn } = useContext(UserContext);

    async function handleCommentDelete(e) {
        e.preventDefault();

        if (props.userId !== userIdLoggedIn) {
            alert("You cannot delete this comment as you did not create it!");
            return;
        }

        const accessToken = localStorage.getItem("accessToken");
        const gotNewAccessToken = getNewAccessTokenIfExpired(accessToken);

        if (gotNewAccessToken) {
            const response = await fetch(`http://localhost:8000/api/comment/id=${props.commentId}/user-id=${props.userId}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
            });
            if (response.ok) {
                props.deleteComment(props.commentId);
            } else {
                throw new Error("Couldn't delete comment!");
            }
        }
        else {
            throw new Error("Couldn't get new access token!");
        }
    }

    return (
         <BsFillTrashFill className="delete-comment-button" onClick={handleCommentDelete} />
    );
}

DeleteComment.propTypes = {
    deleteComment: PropTypes.func,
    userId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    commentId: PropTypes.string
}

export default DeleteComment