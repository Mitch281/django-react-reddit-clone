import { BsFillTrashFill } from "react-icons/bs";
import PropTypes from "prop-types";
import { useContext } from "react";
import { UserContext } from "../../App";
import { getNewAccessTokenIfExpired } from "../../utils/auth";

const DeletePost = (props) => {

    const { userIdLoggedIn } = useContext(UserContext);

    async function deletePost() {
        if (props.userId !== userIdLoggedIn) {
            alert("You cannot delete this post because you did not create it!");
            return;
        }

        const accessToken = localStorage.getItem("accessToken");
        const gotNewAccessToken = await getNewAccessTokenIfExpired(accessToken);

        if (gotNewAccessToken) {
            const response = await fetch(`http://localhost:8000/api/post/id=${props.postId}/user-id=${props.userId}/`, {
                method: "DELETE",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                props.deletePost(props.postId);
            } else {
                throw new Error("Couldn't delete post");
            }
        }
        else {
            throw new Error("Couldn't fetch new acces token");
        }

    }

    return (
        <BsFillTrashFill className="delete-post-button" onClick={deletePost} />
    );
};

DeletePost.propTypes = {
    postId: PropTypes.string,
    userId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    deletePost: PropTypes.func
}

export default DeletePost;
