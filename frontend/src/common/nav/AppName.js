import { Link } from "react-router-dom";
import styles from "./styles/navbar.module.css";

const AppName = ({ isMobile }) => {
    let content = "";
    if (!isMobile) {
        content = (
            <Link to="/" id={styles["navbar-site-name"]}>
                <h1>Threddit</h1>
            </Link>
        );
    }
    return content;
};

export default AppName;
