import { createContext, useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
} from "react-router-dom";
import LoginPage from "./components/Auth/LoginPage";
import SignupPage from "./components/Auth/SignupPage";
import Navbar from "./common/nav/Navbar";
import Posts from "./features/posts/Posts";
import Comments from "./features/comments/Comments";
import PostSelected from "./features/posts/PostSelected";
import { getNewAccessTokenIfExpired, verifyCurrentUser } from "./utils/auth";
import CreateCategoryForm from "./features/categories/CreateCategoryForm";
import LinkToCreatePost from "./components/Post/LinkToCreatePost/LinkToCreatePost";
import AddPostForm from "./features/posts/AddPostForm";

export const UserContext = createContext();
//TODO: HANDLE TOKEN REFRESH WHEN TOKEN EXPIRES FOR NEW CODE!
function App() {
    const [usernameLoggedIn, setUsernameLoggedIn] = useState("");
    const [userIdLoggedIn, setUserIdLoggedIn] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    // This function relogs in a user whenever they navigate to a different page or refresh the page.
    async function reLogin() {
        const accessToken = localStorage.getItem("accessToken");
        try {
            // Get new access token using the refresh token if the access token is expired.
            await getNewAccessTokenIfExpired(accessToken);

            // Get the access token. This should always work because if our access token has expired, then the
            // getNewAccessTokenIfExpired function above will get a new access token using the refresh token, and so
            // we will be able to use that access token to get the current user information.
            const json = await verifyCurrentUser();

            setLoggedIn(true);
            setUserIdLoggedIn(json.id);
            setUsernameLoggedIn(json.username);
        } catch (error) {
            throw error;
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
