import { useContext, useState } from "react";
import { UserContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import "../../../style/login-signup.css";
import { BiErrorCircle } from "react-icons/bi";

const LoginPage = () => {

    let navigate = useNavigate();

    const {setUsernameLoggedIn, setLoggedIn, setUserIdLoggedIn} = useContext(UserContext);

    const [error, setError] = useState("");
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // TODO: data validation.
    // TODO: error handling.
    // NOTE: State persists through router change but not through page refresh so handle that.
    async function handleLogin() {

        const response = await fetch("http://localhost:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: username, password: password}) 
        });
        if (response.ok) {
            const json = await response.json();
            localStorage.setItem("accessToken", json.access);
            localStorage.setItem("refreshToken", json.refresh);
            setLoggedIn(true);
            setUserIdLoggedIn(json.user_id);
            setUsernameLoggedIn(username);
            navigate("/");
        } else {
            throw new Error(response.status);
        }
    }

    function performLogin(e) {
        e.preventDefault();

        handleLogin()
        .catch(error => setError(error));
    }

    function getErrorMessage() {

        // There is no error because the user hasn't submitted a login request yet.
        if (!error) {
            return;
        }

        if (error.message === "401") {
            return (
                <div id="auth-error-flex-container">
                    <div id="auth-error">
                        <BiErrorCircle />
                        <span>Wrong username or password.</span>
                    </div>
                </div>
            );
        }
    }

    return (
        <>
            <div id="login">
                <form onSubmit={performLogin}>
                    <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input type="submit" value="login" />
                </form>
            </div>
            {getErrorMessage()}
        </>
    )
}

export default LoginPage
