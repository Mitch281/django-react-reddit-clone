import styles from "./styles/title.module.css";

type Props = {
    title: string;
};

const Title = ({ title }: Props) => {
    return <h1 className={styles["post-title"]}>{title}</h1>;
};

export default Title;
