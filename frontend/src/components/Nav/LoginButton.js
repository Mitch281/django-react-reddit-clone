import { useNavigate } from "react-router-dom"

const LoginButton = () => {
    let navigate = useNavigate();

    function handleLoginClick() {
        navigate("/login/");
    }

    return (
        <button type="button" onClick={handleLoginClick}>
            Login
        </button>
    )
}

export default LoginButton
