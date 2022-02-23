import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import styles from "./login-signup.module.css";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../constants";

const LoginPage = () => {
    let navigate = useNavigate();

    const { setUsernameLoggedIn, loggedIn, setLoggedIn, setUserIdLoggedIn } =
        useContext(UserContext);


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState();

    const [loading, setLoading] = useState(false);

    // TODO: data validation.
    // TODO: error handling.
    // NOTE: State persists through router change but not through page refresh so handle that.
    async function handleLogin() {
        setLoading(true);

        const response = await fetch("http://localhost:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: username, password: password }),
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

        handleLogin().catch((error) => setError(error));
    }

    useEffect(() => {
        setLoading(false);
    }, [error, loggedIn]);

    function getErrorMessage() {
        // There is no error because the user hasn't submitted a login request yet or the request was successful.
        if (!error) {
            return;
        }

        if (error.message === "401") {
            return (
                <div id={styles["login"]}>
                    <ErrorMessage
                        errorMessage={"Wrong username or password."}
                    />
                </div>
            );
        }

        return (
            <div id={styles["login"]}>
                <ErrorMessage
                    errorMessage={"Couldn't login. Please try again later"}
                />
            </div>
        );
    }

    return (
        <>
            <div id={styles["login"]}>
                <form onSubmit={performLogin}>
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
                    {loading ? (
                        <ClipLoader
                            color={constants.loaderColour}
                            loading={true}
                            size={20}
                            css={"margin-top: 10px"}
                        />
                    ) : (
                        <input type="submit" value="Login" />
                    )}
                </form>
            </div>
            {getErrorMessage()}
        </>
    );
};

export default LoginPage;
