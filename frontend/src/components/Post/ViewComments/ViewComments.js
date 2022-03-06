import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { fetchNumberOfCommentsOnPost } from "../../../utils/fetch-data";
import styles from "./view-comments.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../../constants";
import { BsFillExclamationCircleFill } from "react-icons/bs";

const ViewComments = (props) => {
    const [numComments, setNumComments] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    async function loadNumberOfComments() {
        setLoading(true);
        try {
            const json = await fetchNumberOfCommentsOnPost(props.postId);
            setNumComments(json.num_comments);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function getNumberOfComments() {
            await loadNumberOfComments();
        }

        getNumberOfComments();
        // eslint-disable-next-line
    }, []);

    function getOutput() {
        if (error) {
            return (
                <BsFillExclamationCircleFill
                    color={constants.errorMessageColour}
                />
            );
        } else if (loading) {
            return (
                <ClipLoader
                    color={constants.loaderColour}
                    loading={true}
                    size={20}
                    css={"margin-top: 10px"}
                />
            );
        }

        return (
            <>
                <BiCommentDetail />
                <span>
                    {numComments} {numComments === 1 ? "Comment" : "Comments"}
                </span>
            </>
        );
    }

    return (
        <div
            className={styles["nav-to-comments"]}
            onClick={() => props.navigateToPost(props.postId)}
        >
            {getOutput()}
        </div>
    );
};

ViewComments.propTypes = {
    postId: PropTypes.string,
    navigateToPost: PropTypes.func,
};

export default ViewComments;
