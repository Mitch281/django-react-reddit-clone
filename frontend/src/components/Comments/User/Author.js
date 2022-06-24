import styles from "./user.module.css";

const Author = ({ username }) => {
    return (
        <span className={styles["comment-username"]}>{username} &nbsp;</span>
    );
}

export default Author;
