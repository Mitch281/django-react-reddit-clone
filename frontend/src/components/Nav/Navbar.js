import { Link, useParams } from "react-router-dom";
import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";
import LogoutButton from "./LogoutButton";
import "../../style/navbar.css";
import { useContext } from "react";
import CategoryDropdown from "./CategoryDropdown";
import { UserContext } from "../../App";

const Navbar = () => {
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
                <CategoryDropdown activeCategory={activeCategory}/>
                <li id="navbar-auth">
                    {!loggedIn ? <><LoginButton /><SignupButton /></> : <LogoutButton />}
                </li>
            </ul>
        </div>
    )
}

export default Navbar
