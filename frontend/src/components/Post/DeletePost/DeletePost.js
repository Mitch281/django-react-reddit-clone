import { BsFillTrashFill } from "react-icons/bs";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { UserContext } from "../../../App";
import styles from "./delete-post.module.css";
import { fetchDeletePost } from "../../../utils/fetch-data";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../../constants";
import { CantGetNewAccessTokenError } from "../../../utils/auth";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

const DeletePost = (props) => {
    const { userIdLoggedIn } = useContext(UserContext);

    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    async function deletePost() {
        try {
            await fetchDeletePost(props.postId, userIdLoggedIn);
            props.deletePost(props.postId);
        } catch (error) {
            throw error;
        }
    }

    async function performDeletePost() {
        const wantDelete = window.confirm(
            "Are you sure you want to delete this post?"
        );
        if (!wantDelete) {
            return;
        }

        if (props.userId !== userIdLoggedIn) {
            alert("You cannot delete this post because you did not create it!");
            return;
        }

        setLoading(true);

        try {
            await deletePost();
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    function getErrorMessage() {
        if (!error) {
            return;
        }

        if (error instanceof CantGetNewAccessTokenError) {
            return (
                <ErrorMessage errorMessage="Session expired. Please login again." />
            );
        } else if (error.message === "401") {
            return (
                <ErrorMessage errorMessage="Cannot delete this post as you did not create it!" />
            );
        } else {
            return (
                <ErrorMessage errorMessage="Could not delete post. Please try again later." />
            );
        }
    }

    return (
        <>
            {loading ? (
                <ClipLoader
                    id={styles["loader"]}
                    color={constants.loaderColour}
                    loading={true}
                    size={20}
                    css={"float: right;"}
                />
            ) : (
                <BsFillTrashFill
                    className={styles["delete-post-button"]}
                    onClick={performDeletePost}
                />
            )}
            {getErrorMessage()}
        </>
    );
};

DeletePost.propTypes = {
    postId: PropTypes.string,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    deletePost: PropTypes.func,
};

export default DeletePost;
