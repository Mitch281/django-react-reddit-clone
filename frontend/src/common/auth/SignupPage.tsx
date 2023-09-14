import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../app/App";
import { SignupResponse } from "../../types/shared";
import { signup } from "../../utils/auth";
import { constants } from "../../utils/constants";
import styles from "./styles/login-signup.module.css";

const SignupPage = () => {
    const navigate = useNavigate();

    const { setUsernameLoggedIn, setLoggedIn, setUserIdLoggedIn } =
        useContext(UserContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [signupStatus, setSignupStatus] = useState("idle");

    async function handleSignup() {
        if (password !== confirmPassword) {
            alert(
                "Password entered is not the same as confirmed password entered!"
            );
            return;
        }

        try {
            const json: SignupResponse = await signup(username, password);
            setLoggedIn(true);
            setUsernameLoggedIn(json.username);
            setUserIdLoggedIn(json.id.toString());
            localStorage.setItem("accessToken", json.token.access);
            localStorage.setItem("refreshToken", json.token.refresh);
            navigate("/");
        } catch (error) {
            throw error;
        }
    }

    async function performSignup(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSignupStatus("pending");

        try {
            await handleSignup();
        } catch (error: any) {
            toast.error(error.message, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setSignupStatus("idle");
        }
    }

    let submitButton;
    if (signupStatus === "pending") {
        submitButton = (
            <ClipLoader
                color={constants.loaderColour}
                loading={true}
                size={20}
                css={"margin-top: 10px"}
            />
        );
    } else {
        submitButton = <input type="submit" value="Signup" />;
    }

    return (
        <>
            <div id={styles["signup"]}>
                <form id={styles["signup-form"]} onSubmit={performSignup}>
                    <input
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {submitButton}
                    <span id={styles["already-have-an-account"]}>
                        Already have an account? &nbsp;
                        <Link to="/login/" id={styles["login-link"]}>
                            Login
                        </Link>
                    </span>
                </form>
            </div>
        </>
    );
};

export default SignupPage;
