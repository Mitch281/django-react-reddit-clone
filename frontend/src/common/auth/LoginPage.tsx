import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginResponse } from "../../../types";
import { UserContext } from "../../app/App";
import { login } from "../../utils/auth";
import { constants } from "../../utils/constants";
import styles from "./styles/login-signup.module.css";

const LoginPage = () => {
    let navigate = useNavigate();

    const { setUsernameLoggedIn, setLoggedIn, setUserIdLoggedIn } =
        useContext(UserContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loginStatus, setLoginStatus] = useState("idle");

    async function handleLogin() {
        try {
            const json: LoginResponse = await login(username, password);
            localStorage.setItem("accessToken", json.access);
            localStorage.setItem("refreshToken", json.refresh);
            setLoggedIn(true);
            setUserIdLoggedIn(json.user_id.toString());
            setUsernameLoggedIn(username);
            navigate("/", { state: { userId: json.user_id } });
        } catch (error) {
            throw error;
        }
    }

    async function performLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoginStatus("pending");

        try {
            await handleLogin();
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
            setLoginStatus("idle");
        }
    }

    let submitButton;
    if (loginStatus === "pending") {
        submitButton = (
            <ClipLoader
                color={constants.loaderColour}
                loading={true}
                size={20}
                css={"margin-top: 10px"}
            />
        );
    } else {
        submitButton = <input type="submit" value="Login" />;
    }

    return (
        <>
            <div id={styles["login"]}>
                <form id={styles["login-form"]} onSubmit={performLogin}>
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
                    {submitButton}
                    <span id={styles["dont-have-an-account"]}>
                        Don't have an account? &nbsp;
                        <Link id={styles["signup-link"]} to="/signup/">
                            Signup
                        </Link>
                    </span>
                </form>
            </div>
        </>
    );
};

export default LoginPage;
