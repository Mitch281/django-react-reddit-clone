import { useContext, useState } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {

    let navigate = useNavigate();

    const {setUsernameLoggedIn, setLoggedIn, setUserIdLoggedIn} = useContext(UserContext);
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // TODO: data validation.
    // TODO: error handling.
    // NOTE: State persists through router change but not through page refresh so handle that.
    async function handleLogin(e) {
        e.preventDefault();
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
            throw new Error("Can't login!");
        }
    }

    return (
        <div>
            <form onSubmit={(e) => handleLogin(e)}>
                <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="submit" value="login" />
            </form>
        </div>
    )
}

export default LoginPage
