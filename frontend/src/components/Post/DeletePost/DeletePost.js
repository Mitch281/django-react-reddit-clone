import { BsFillTrashFill } from "react-icons/bs";
import PropTypes from "prop-types";
import { useContext } from "react";
import { UserContext } from "../../../App";
import styles from "./delete-post.module.css";
import { fetchDeletePost } from "../../../utils/fetch-data";

const DeletePost = (props) => {

    const { userIdLoggedIn } = useContext(UserContext);

    async function deletePost() {
        try {
            await fetchDeletePost(props.postId, userIdLoggedIn);
            props.deletePost(props.postId);
        } catch(error) {
            throw error;
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
