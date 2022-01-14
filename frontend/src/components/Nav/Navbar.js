import { Link, useParams } from "react-router-dom";
import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";
import LogoutButton from "./LogoutButton";
import "../../style/navbar.css";
import { useRef, useEffect, useContext } from "react";
import CategoryDropdown from "./CategoryDropdown";
import { UserContext } from "../../App";

const Navbar = () => {
    // TODO: check why dynamic margin left styling is not working!

    const {usernameLoggedIn, loggedIn, setUsernameLoggedIn, setLoggedIn} = useContext(UserContext);

    const params = useParams();
    const activeCategory = params.categoryName;

    const ref = useRef(null);

    const categoryDropdownMargin = useRef();

    // When component renders, we will get the width of the header. This will be used to ensure that the margin on the
    // category dropdown is adequate enough so that it does not collide with the header.
    useEffect(() => {
        const headerWidth = ref.current.offsetWidth;
        categoryDropdownMargin.current = `min(${headerWidth + 10}, 40%)`;
    }, []);

    return (
        <div id="navbar">
            <Link to="/" id="navbar-site-name"><h1 ref={ref}>Threddit</h1></Link>
            <CategoryDropdown activeCategory={activeCategory}/>
            <div id="navbar-auth">
                {!loggedIn ? <><LoginButton /><SignupButton /></> : <LogoutButton />}
            </div>
        </div>
    )
}

export default Navbar
