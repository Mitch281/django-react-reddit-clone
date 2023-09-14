import styles from "./styles/navbar.module.css";

type Props = {
    username: string;
};

const SignedInAsUsername = ({ username }: Props) => {
    const usernameElement = <span id={styles["username"]}>{username}</span>;
    return <span>Signed in as {usernameElement}</span>;
};

export default SignedInAsUsername;
