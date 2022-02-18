import { BsFillTrashFill } from "react-icons/bs";
import PropTypes from "prop-types";
import { useContext } from "react";
import { UserContext } from "../../../App";
import { getNewAccessTokenIfExpired } from "../../../utils/auth";
import styles from "./delete-post.module.css";

const DeletePost = (props) => {

    const { userIdLoggedIn } = useContext(UserContext);

    async function deletePost() {

        const accessToken = localStorage.getItem("accessToken");
        try {
            await getNewAccessTokenIfExpired(accessToken);
        } catch(error) {
            throw error;
        }

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
            throw new Error(response.status);
        }
    }

    function performDeletePost() {
        if (props.userId !== userIdLoggedIn) {
            alert("You cannot delete this post because you did not create it!");
            return;
        }

        deletePost()
        .catch(error => console.log(error));
    }

    return (
        <BsFillTrashFill className={styles["delete-post-button"]} onClick={performDeletePost} />
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
