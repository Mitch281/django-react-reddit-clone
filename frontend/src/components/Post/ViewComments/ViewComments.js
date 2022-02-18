import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { BiCommentDetail } from "react-icons/bi";
import styles from "./view-comments.module.css";

const ViewComments = (props) => {

    const [numComments, setNumComments] = useState();
    
    async function getNumberOfComments() {
        const response = await fetch(`http://localhost:8000/api/post/num-comments/id=${props.postId}/`);
        if (response.ok) {
            const json = await response.json();
            setNumComments(json.num_comments);
        } else {
            throw new Error (response.status);
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
