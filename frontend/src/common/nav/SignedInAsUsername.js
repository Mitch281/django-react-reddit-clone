import styles from "./styles/navbar.module.css";

const SignedInAsUsername = ({ username }) => {
    const usernameElement = <span id={styles["username"]}>{username}</span>;
    return <span>Signed in as {usernameElement}</span>;
};

export default SignedInAsUsername;
