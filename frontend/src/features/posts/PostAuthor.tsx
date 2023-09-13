import styles from "./styles/post-author.module.css";

type Props = {
    username: string;
};

const PostAuthor = ({ username }: Props) => {
    return (
        <span>
            Posted by <span className={styles["username"]}>{username}</span>{" "}
            &nbsp;
        </span>
    );
};

export default PostAuthor;
