import { useNavigate } from "react-router-dom";

const SignupButton = () => {
    let navigate = useNavigate();

    function handleSignupClick() {
        navigate("/signup/");
    }

    return (
        <button type="button" onClick={handleSignupClick}>
            Signup
        </button>
    )
}

export default SignupButton
