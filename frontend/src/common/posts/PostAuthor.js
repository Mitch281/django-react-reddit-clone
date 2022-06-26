import styles from "../styles/post-author.module.css";

const PostAuthor = ({ username }) => {
    return (
        <span>
            Posted by{" "}
            <span className={styles["username"]}>{username}</span> &nbsp;
        </span>
    );
};

export default PostAuthor;
