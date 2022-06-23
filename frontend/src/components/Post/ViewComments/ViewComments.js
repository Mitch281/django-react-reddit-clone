import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiCommentDetail } from "react-icons/bi";
import { fetchNumberOfCommentsOnPost } from "../../../utils/fetch-data";
import styles from "./view-comments.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../../constants";
import { BsFillExclamationCircleFill } from "react-icons/bs";

const ViewComments = ({ postId }) => {
    const [numComments, setNumComments] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    async function loadNumberOfComments() {
        setLoading(true);
        try {
            const json = await fetchNumberOfCommentsOnPost(postId);
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
        <Link className={styles["nav-to-comments"]} to={`/post=${postId}/comments/`}>
            {getOutput()}
        </Link>
    );
};

export default ViewComments;
