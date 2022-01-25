import { Link, useParams } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "../../style/navbar.css";
import { useContext } from "react";
import CategoryDropdown from "./CategoryDropdown";
import { UserContext } from "../../App";
import PropTypes from "prop-types";

const Navbar = (props) => {
    // TODO: check why dynamic margin left styling is not working!

    const {loggedIn} = useContext(UserContext);

    const params = useParams();
    const activeCategory = params.categoryName;

    return (
        <div id="navbar">
            <ul id="navbar-nav">
                <li id="site-name">
                    <Link to="/" id="navbar-site-name"><h1>Threddit</h1></Link>
                </li>
                <CategoryDropdown activeCategory={activeCategory} categories={props.categories} />
                <li id="navbar-auth">
                    {loggedIn ? <LogoutButton /> : 
                        <>
                            <Link id="nav-to-login" to="/login/">Login</Link>
                            <Link id="nav-to-signup" to="/signup/">Signup</Link>
                        </>
                    }
                </li>
            </ul>
        </div>
    )
}

Navbar.propTypes = {
    categories: PropTypes.array
}

export default Navbar
