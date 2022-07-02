import { createContext, useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";
import Navbar from "../common/nav/Navbar";
import LinkToCreatePost from "../common/posts/LinkToCreatePost";
import { getNewAccessToken, isTokenExpired, verifyCurrentUser } from "../common/utils/auth";
import LoginPage from "../common/auth/LoginPage";
import SignupPage from "../common/auth/SignupPage";
import CreateCategoryForm from "../features/categories/CreateCategoryForm";
import Comments from "../features/comments/Comments";
import AddPostForm from "../features/posts/AddPostForm";
import Posts from "../features/posts/Posts";
import PostSelected from "../features/posts/PostSelected";

export const UserContext = createContext();
//TODO: HANDLE REFRESH TOKEN EXPIRY!!
function App() {
    const [usernameLoggedIn, setUsernameLoggedIn] = useState("");
    const [userIdLoggedIn, setUserIdLoggedIn] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    // This function relogs in a user whenever they navigate to a different page or refresh the page.
    async function reLogin() {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return;
        }

        // Access token is expired, so we get a new access token using the refresh token.
        if (isTokenExpired(accessToken)) {
            try {
                await getNewAccessToken();
            } catch (error) {
                return Promise.reject(error);
            }
        } else {
            try {
                const response = await verifyCurrentUser();
                const json = await response.json();
                setLoggedIn(true);
                setUserIdLoggedIn(json.id);
                setUsernameLoggedIn(json.username);
            } catch (error) {
                return Promise.reject(error);
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
    }, []);

    return (
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
    );
}

export default App;
