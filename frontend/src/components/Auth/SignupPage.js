import { useState } from "react";

const SignupPage = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div>
            <form>
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
