import styles from "../styles/title.module.css";

const Title = ({ title }) => {
    return <h1 className={styles["post-title"]}>{title}</h1>;
};

export default Title;
