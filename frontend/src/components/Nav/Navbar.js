import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";
import "../../style/navbar.css";
import Categories from "./Categories";
import { useRef } from "react";

const Navbar = () => {
    
    const categoryDropdown = useRef(false);

    return (
        <div className="navbar">
            <Link to="/"><h1>Threddit</h1></Link>
            <Categories />
            <LoginButton />
            <SignupButton />
        </div>
    )
}

export default Navbar
