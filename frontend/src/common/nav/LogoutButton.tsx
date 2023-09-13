import { useContext } from "react";
import { UserContext } from "../../app/App";
import styles from "./styles/logout-button.module.css";

const LogoutButton = () => {
    const { logout } = useContext(UserContext);

    return (
        <button type="button" onClick={logout} id={styles["logout-button"]}>
            <span>Logout</span>
        </button>
    );
};

export default LogoutButton;
