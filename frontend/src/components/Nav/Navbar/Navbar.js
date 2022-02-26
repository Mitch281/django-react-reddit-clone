import { Link, useParams } from "react-router-dom";
import LogoutButton from "../LogoutButton/LogoutButton";
import { useContext } from "react";
import CategoryDropdown from "../CategoryDropdown/CategoryDropdown";
import { UserContext } from "../../../App";
import PropTypes from "prop-types";
import styles from "./navbar.module.css";

const Navbar = (props) => {
    const { loggedIn } = useContext(UserContext);

    const params = useParams();
    const activeCategory = params.categoryName;

    return (
        <div id={styles["navbar"]}>
            <ul id={styles["navbar-nav"]}>
                <li>
                    <Link to="/" id={styles["navbar-site-name"]}>
                        <h1>Threddit</h1>
                    </Link>
                </li>
                <CategoryDropdown
                    activeCategory={activeCategory}
                    categories={props.categories}
                    categoriesLoading={props.categoriesLoading}
                    categoryLoadingError={props.categoryLoadingError}
                />
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

Navbar.propTypes = {
    categories: PropTypes.array,
    categoryLoadingError: PropTypes.instanceOf(Error)
};

export default Navbar;
