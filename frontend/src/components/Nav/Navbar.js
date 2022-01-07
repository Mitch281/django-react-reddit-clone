import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";
import "../../style/navbar.css";

const Navbar = () => {

    return (
        <div id="navbar">
            <Link to="/"><h1>Threddit</h1></Link>
            <select id="categories">
                {/* Categories */}
            </select>
            <LoginButton />
            <SignupButton />
        </div>
    )
}

export default Navbar
