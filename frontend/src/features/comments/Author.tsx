import styles from "./styles/author.module.css";

type Props = {
    username: string;
};

const Author = ({ username }: Props) => {
    return (
        <span className={styles["comment-username"]}>{username} &nbsp;</span>
    );
};

export default Author;
