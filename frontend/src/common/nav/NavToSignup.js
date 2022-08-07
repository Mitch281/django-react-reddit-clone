import { Link } from "react-router-dom";
import styles from "./styles/navbar.module.css";

const NavToSignup = () => {
    return (
        <Link id={styles["nav-to-signup"]} to="/signup/">
            Signup
        </Link>
    );
};

export default NavToSignup;
