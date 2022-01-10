import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";
import "../../style/navbar.css";
import Categories from "./Categories";

const Navbar = () => {

    return (
        <div className="navbar">
            <Link to="/"><h1>Threddit</h1></Link>
            <div className="select-categories">
                <Categories />
            </div>
            <LoginButton />
            <SignupButton />
        </div>
    )
}

export default Navbar
