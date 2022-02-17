import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../App";
import { BiErrorCircle } from "react-icons/bi";


const SignupPage = () => {

    let navigate = useNavigate("/");

    const {setUsernameLoggedIn, setLoggedIn, setUserIdLoggedIn} = useContext(UserContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");

    async function handleSignup() {
        
        if (password !== confirmPassword) {
            throw new Error("Passwords not the same");
        }

        const response = await fetch("http://localhost:8000/api/users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: username, password: password})
        });
        if (response.ok) {
            const json = await response.json();
            setLoggedIn(true);
            setUsernameLoggedIn(json.username);
            setUserIdLoggedIn(json.id);
            localStorage.setItem("accessToken", json.token.access);
            localStorage.setItem("refreshToken", json.token.refresh);
            navigate("/");
        } else {
            throw new Error(response.status);
        }
    }

    function performSignup(e) {
        e.preventDefault();

        handleSignup()
        .catch(error => setError(error));
    }

    function getErrorMessage() {
        if (!error) {
            return;
        }
        
        if (error.message === "400") {
            return (
                <div id="auth-error-flex-container">
                    <div id="auth-error">
                        <BiErrorCircle />
                        <span>Username already in use!</span>
                    </div>
                </div>
            );
        }
        else if (error.message === "Passwords not the same") {
            return (
                <div id="auth-error-flex-container">
                    <div id="auth-error">
                        <BiErrorCircle />
                        <span>The passwords entered are not the same.</span>
                </div>
            </div>
            );
        }
    }

    return (
        <>
            <div id="signup">
                <form onSubmit={performSignup}>
                    <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input type="password" placeholder="confirm password" value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} />
                    
                    <input type="submit" value="Signup" />
                </form>
            </div>
            {getErrorMessage()}
        </>
    )
}

export default SignupPage
