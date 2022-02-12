import { useContext } from "react";
import { UserContext } from "../../App";

const LogoutButton = () => {

    const {setUsernameLoggedIn, setLoggedIn, setUserIdLoggedIn, logout} = useContext(UserContext);

    return (
        <button type="button" onClick={logout} id="logout-button">
            <span>Logout</span>
        </button>
    );
};

export default LogoutButton;
