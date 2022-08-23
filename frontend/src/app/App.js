import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginPage from "../common/auth/LoginPage";
import SignupPage from "../common/auth/SignupPage";
import Navbar from "../common/nav/Navbar";
import LinkToCreatePost from "../features/posts/LinkToCreatePost";
import CreateCategoryForm from "../features/categories/CreateCategoryForm";
import Comments from "../features/comments/Comments";
import AddPostForm from "../features/posts/AddPostForm";
import Posts from "../features/posts/Posts";
import PostSelected from "../features/posts/PostSelected";
import {
    getNewAccessToken,
    handleCantReLoginError,
    isTokenExpired,
    verifyCurrentUser,
} from "../utils/auth";

export const UserContext = createContext();
// TODO: Handle multiple unecessary fetches.
// TODO: Upgrade to latest version of react so we can see which renders are due to strict mode (greyed out),
// and which are actual renders!
function App() {
    const [usernameLoggedIn, setUsernameLoggedIn] = useState("");
    const [userIdLoggedIn, setUserIdLoggedIn] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    // This function relogs in a user whenever they navigate to a different page or refresh the page.
    async function reLogin() {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken === null) {
            return;
        }

        // Access token is expired, so we get a new access token using the refresh token.
        if (isTokenExpired(accessToken)) {
            try {
                await getNewAccessToken();
            } catch (error) {
                handleCantReLoginError(error, logout);
            }
        } else {
            try {
                const response = await verifyCurrentUser();
                const json = await response.json();
                setLoggedIn(true);
                setUserIdLoggedIn(json.id);
                setUsernameLoggedIn(json.username);
            } catch (error) {
                handleCantReLoginError(error, logout);
            }
        }
    }

    function logout() {
        setLoggedIn(false);
        setUsernameLoggedIn("");
        setUserIdLoggedIn("");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }

    useEffect(() => {
        reLogin();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Router>
                <UserContext.Provider
                    value={{
                        usernameLoggedIn,
                        userIdLoggedIn,
                        loggedIn,
                        setUsernameLoggedIn,
                        setUserIdLoggedIn,
                        setLoggedIn,
                        reLogin,
                        logout,
                    }}
                >
                    <div className="App">
                        <Routes>
                            <Route
                                exact
                                path="/"
                                element={
                                    <>
                                        <Navbar />
                                        <Posts />
                                        <LinkToCreatePost />
                                    </>
                                }
                            />
                            <Route
                                exact
                                path="/:order/"
                                element={
                                    <>
                                        <Navbar />
                                        <Posts />
                                        <LinkToCreatePost />
                                    </>
                                }
                            />
                            <Route
                                exact
                                path="/login/"
                                element={
                                    <>
                                        <Navbar />
                                        <LoginPage />
                                    </>
                                }
                            />
                            <Route
                                exact
                                path="/signup/"
                                element={
                                    <>
                                        <Navbar />
                                        <SignupPage />
                                    </>
                                }
                            />
                            <Route
                                exact
                                path="posts/category=:categoryName"
                                element={
                                    <>
                                        <Navbar />
                                        <Posts />
                                        <LinkToCreatePost />
                                    </>
                                }
                            />
                            <Route
                                exact
                                path="posts/category=:categoryName/:order"
                                element={
                                    <>
                                        <Navbar />
                                        <Posts />
                                        <LinkToCreatePost />
                                    </>
                                }
                            />
                            <Route
                                exact
                                path="post=:postId/comments"
                                element={
                                    <>
                                        <Navbar />
                                        <PostSelected />
                                        <Comments />
                                    </>
                                }
                            />
                            <Route
                                exact
                                path="post=:postId/comments/:order"
                                element={
                                    <>
                                        <Navbar />
                                        <PostSelected />
                                        <Comments />
                                    </>
                                }
                            />
                            <Route
                                exact
                                path="/create-post/"
                                element={
                                    <>
                                        <Navbar />
                                        <AddPostForm />
                                    </>
                                }
                            />
                            <Route
                                exact
                                path="/create-category/"
                                element={
                                    <>
                                        <Navbar />
                                        <CreateCategoryForm />
                                    </>
                                }
                            />
                        </Routes>
                    </div>
                </UserContext.Provider>
            </Router>
            <ToastContainer />
        </>
    );
}

export default App;
