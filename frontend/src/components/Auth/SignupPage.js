import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import styles from "./login-signup.module.css";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../constants";
import { signup } from "../../utils/auth";

const SignupPage = () => {
    let navigate = useNavigate("/");

    const { setUsernameLoggedIn, setLoggedIn, setUserIdLoggedIn } =
        useContext(UserContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState();

    const [loading, setLoading] = useState(false);

    async function handleSignup() {

        if (password !== confirmPassword) {
            throw new Error("Passwords not the same");
        }

        try {
            const json = await signup(username, password);
                setLoggedIn(true);
                setUsernameLoggedIn(json.username);
                setUserIdLoggedIn(json.id);
                localStorage.setItem("accessToken", json.token.access);
                localStorage.setItem("refreshToken", json.token.refresh);
                navigate("/");
        } catch(error) {
            throw error;
        }
    }

    async function performSignup(e) {
        setLoading(true);
        e.preventDefault();

        try {
            await handleSignup();
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    function getErrorMessage() {
        if (!error) {
            return;
        }

        if (error.message === "400") {
            return (
                <div id={styles["login"]}>
                    <ErrorMessage errorMessage={"Username already in use!"} />
                </div>
            );
        } else if (error.message === "Passwords not the same") {
            return (
                <div id={styles["signup"]}>
                    <ErrorMessage
                        errorMessage={"Passwords entered are not the same!"}
                    />
                </div>
            );
        }

        return (
            <div id={styles["signup"]}>
                <ErrorMessage
                    errorMessage={"Could't signup. Please try again later."}
                />
            </div>
        );
    }

    return (
        <>
            <div id={[styles["signup"]]}>
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

                    {loading ? (
                        <ClipLoader
                            color={constants.loaderColour}
                            loading={true}
                            size={20}
                            css={"margin-top: 10px"}
                        />
                    ) : (
                        <input type="submit" value="Signup" />
                    )}
                    <span id={styles["already-have-an-account"]}>Already have an account? &nbsp;
                        <Link to="/login/" id={styles["login-link"]}>Login</Link>
                    </span>
                </form>
            </div>
            {getErrorMessage()}
        </>
    );
};

export default SignupPage;
