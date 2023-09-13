import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../app/App";
import CategoryDropdown from "../../features/categories/CategoryDropdown";
import AppName from "./AppName";
import LogoutButton from "./LogoutButton";
import NavToLogin from "./NavToLogin";
import NavToSignup from "./NavToSignup";
import SignedInAsUsername from "./SignedInAsUsername";
import styles from "./styles/navbar.module.css";

const Navbar = () => {
    const { loggedIn, usernameLoggedIn } = useContext(UserContext);

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
        <nav id={styles["navbar"]}>
            <div id={styles["navbar-nav"]}>
                <div id={styles["app-name-and-dropdown"]}>
                    <AppName isMobile={isMobile} />
                    <CategoryDropdown />
                </div>
                {loggedIn ? (
                    <div id={styles["username-and-logout-button"]}>
                        <SignedInAsUsername username={usernameLoggedIn} />
                        <LogoutButton />
                    </div>
                ) : (
                    <div id={styles["nav-to-login-and-signup"]}>
                        <NavToLogin />
                        <NavToSignup />
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
