import styles from "./styles/author.module.css";

const Author = ({ username }) => {
    return (
        <span className={styles["comment-username"]}>{username} &nbsp;</span>
    );
};

export default Author;
