import { Link } from "react-router-dom";
import styles from "./styles/navbar.module.css";

const NavToLogin = () => {
    return (
        <Link id={styles["nav-to-login"]} to="/login/">
            Login
        </Link>
    );
};

export default NavToLogin;
