import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { useContext, useState, useEffect } from "react";
import CategoryDropdown from "../../features/categories/CategoryDropdown";
import { UserContext } from "../../app/App";
import styles from "./styles/navbar.module.css";

const Navbar = () => {
    const { loggedIn } = useContext(UserContext);

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener("resize", handleWindowSizeChange);
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };
    }, []);

    const isMobile = width <= 768;

    return (
        <div id={styles["navbar"]}>
            <ul id={styles["navbar-nav"]}>
                {!isMobile ? (
                    <li>
                        <Link to="/" id={styles["navbar-site-name"]}>
                            <h1>Threddit</h1>
                        </Link>
                    </li>
                ) : (
                    ""
                )}
                <CategoryDropdown />
                <li id={styles["navbar-auth"]}>
                    {loggedIn ? (
                        <LogoutButton />
                    ) : (
                        <>
                            <Link id={styles["nav-to-login"]} to="/login/">
                                Login
                            </Link>
                            <Link id={styles["nav-to-signup"]} to="/signup/">
                                Signup
                            </Link>
                        </>
                    )}
                </li>
            </ul>
        </div>
    );
};

export default Navbar;
