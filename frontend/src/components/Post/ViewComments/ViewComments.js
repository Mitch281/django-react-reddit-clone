import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { fetchNumberOfCommentsOnPost } from "../../../utils/fetch-data";
import styles from "./view-comments.module.css";

const ViewComments = (props) => {

    const [numComments, setNumComments] = useState();
    
    async function getNumberOfComments() {
        try {
            const json = await fetchNumberOfCommentsOnPost(props.postId);
            setNumComments(json.num_comments);
        } catch(error) {
            throw error;
        }
    }

    useEffect(() => {
        getNumberOfComments()
        .catch(error => console.log(error));
    }, []);

    return ( 
        <div className={styles["nav-to-comments"]} onClick={() => props.navigateToPost(props.postId)}>
            <BiCommentDetail />
            <span>{numComments} {numComments === 1 ? "Comment" : "Comments"}</span>
        </div>
    );
}

ViewComments.propTypes = {
    postId: PropTypes.string,
    navigateToPost: PropTypes.func
}

export default ViewComments;
