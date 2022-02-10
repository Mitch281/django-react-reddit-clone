import { useContext } from "react";
import { UserContext } from "../../App";

const LogoutButton = () => {

    const {setUsernameLoggedIn, setLoggedIn, setUserIdLoggedIn} = useContext(UserContext);

    function logout() {
        setLoggedIn(false);
        setUsernameLoggedIn("");
        setUserIdLoggedIn("");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }

    return (
        <button type="button" onClick={logout} id="logout-button">
            <span>Logout</span>
        </button>
    );
};

export default LogoutButton;
