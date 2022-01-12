import { useContext, useState } from "react";
import { UserContext } from "../../App";

const SignupPage = () => {

    const {usernameLoggedIn, loggedIn, setUsernameLoggedIn, setLoggedIn} = useContext(UserContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // TODO: getting 500 error? Figure out why.
    async function handleSignup(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords not the same!");
            return;
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
            console.log(json);
        } else {
            throw new Error("failed to signup.");
        }
    }

    return (
        <div>
            <form onSubmit={(e) => handleSignup(e)}>
                <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="password" placeholder="confirm password" value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} />
                
                <input type="submit" value="Signup" />
            </form>
        </div>
    )
}

export default SignupPage
