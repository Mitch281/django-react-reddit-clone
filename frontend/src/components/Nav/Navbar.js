import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";
import "../../style/navbar.css";
import Categories from "./Categories";
import { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Post from "../Home/Post";

const Navbar = () => {
    // TODO: check why dynamic margin left styling is not working!

    const params = useParams();
    const activeCategory = params.categoryName;

    const categoryDropdown = useRef(false);
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
            <Link to="/"><h1 ref={ref}>Threddit</h1></Link>
            <div id="category-dropdown" style={{marginLeft: `${categoryDropdownMargin.current}`}}>
                <Categories activeCategory={activeCategory} />
            </div>
            <div id="navbar-auth">
                <LoginButton />
                <SignupButton />
            </div>
        </div>
    )
}

export default Navbar
