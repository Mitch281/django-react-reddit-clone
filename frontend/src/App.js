import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./components/Auth/LoginPage";
import SignupPage from "./components/Auth/SignupPage";
import Navbar from "./components/Nav/Navbar/Navbar";
import Posts from "./features/posts/Posts";
import Comments from "./features/comments/Comments";
import PostSelected from "./features/posts/PostSelected";
import {
    fetchCategories,
    fetchUsersVotesOnPosts,
    postUpvote,
    patchUsersUpvote,
    postUsersUpvote,
    postDownvote,
    patchUsersDownvote,
    postUsersDownvote,
} from "./utils/fetch-data";
import { getNewAccessTokenIfExpired, verifyCurrentUser } from "./utils/auth";
import CreateCategory from "./components/CreationForms/CreateCategory/CreateCategory";
import CreatePost from "./components/CreationForms/CreatePost/CreatePost";
import LinkToCreatePost from "./components/Post/LinkToCreatePost/LinkToCreatePost";

export const UserContext = createContext();
//TODO: HANDLE TOKEN REFRESH WHEN TOKEN EXPIRES FOR NEW CODE!
function App() {
    const [usernameLoggedIn, setUsernameLoggedIn] = useState("");
    const [userIdLoggedIn, setUserIdLoggedIn] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);

    // This keeps track of posts that users have voted on. This is needed to enforce the rule that users can only vote on a post
    // once.
    const [userPostVotes, setUserPostVotes] = useState([]);

    const [postsLoading, setPostsLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    const [postLoadingError, setPostLoadingError] = useState();
    const [categoryLoadingError, setCategoryLoadingError] = useState();

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

    async function loadCategories() {
        try {
            const json = await fetchCategories();
            setCategories(json);
        } catch (error) {
            throw error;
        }
    }

    function addPost(newPost) {
        setPosts((posts) => [...posts, newPost]);
    }

    function deletePost(postId) {
        setPosts(posts.filter((post) => post.id !== postId));
    }

    function addCategory(newCategory) {
        setCategories((categories) => [...categories, newCategory]);
    }

    function editPostContent(postId, newPostContent) {
        setPosts(
            posts.map((post) =>
                post.id === postId ? { ...post, content: newPostContent } : post
            )
        );
    }

    async function getCategories() {
        setCategoriesLoading(true);
        try {
            await loadCategories();
        } catch (error) {
            setCategoryLoadingError(error);
        } finally {
            setCategoriesLoading(false);
        }
    }

    // Load categories on page load.
    useEffect(() => {
        getCategories();
        // eslint-disable-next-line
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
                                    <Navbar
                                        categories={categories}
                                        categoriesLoading={categoriesLoading}
                                        categoryLoadingError={
                                            categoryLoadingError
                                        }
                                    />
                                    <Posts
                                        userPostVotes={userPostVotes}
                                        deletePost={deletePost}
                                        editPostContent={editPostContent}
                                        postLoadingError={postLoadingError}
                                        postsLoading={postsLoading}
                                    />
                                    <LinkToCreatePost />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/:order/"
                            element={
                                <>
                                    <Navbar
                                        categories={categories}
                                        categoriesLoading={categoriesLoading}
                                        categoryLoadingError={
                                            categoryLoadingError
                                        }
                                    />
                                    <Posts
                                        userPostVotes={userPostVotes}
                                        deletePost={deletePost}
                                        editPostContent={editPostContent}
                                        postLoadingError={postLoadingError}
                                        postsLoading={postsLoading}
                                    />
                                    <LinkToCreatePost />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/login/"
                            element={
                                <>
                                    <Navbar
                                        categories={categories}
                                        categoriesLoading={categoriesLoading}
                                        categoryLoadingError={
                                            categoryLoadingError
                                        }
                                    />
                                    <LoginPage />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/signup/"
                            element={
                                <>
                                    <Navbar
                                        categories={categories}
                                        categoriesLoading={categoriesLoading}
                                        categoryLoadingError={
                                            categoryLoadingError
                                        }
                                    />
                                    <SignupPage />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="posts/category=:categoryName"
                            element={
                                <>
                                    <Navbar
                                        categories={categories}
                                        categoriesLoading={categoriesLoading}
                                        categoryLoadingError={
                                            categoryLoadingError
                                        }
                                    />
                                    <Posts
                                        userPostVotes={userPostVotes}
                                        deletePost={deletePost}
                                        editPostContent={editPostContent}
                                        postLoadingError={postLoadingError}
                                        postsLoading={postsLoading}
                                    />
                                    <LinkToCreatePost />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="posts/category=:categoryName/:order"
                            element={
                                <>
                                    <Navbar
                                        categories={categories}
                                        categoriesLoading={categoriesLoading}
                                        categoryLoadingError={
                                            categoryLoadingError
                                        }
                                    />
                                    <Posts
                                        userPostVotes={userPostVotes}
                                        deletePost={deletePost}
                                        editPostContent={editPostContent}
                                        postLoadingError={postLoadingError}
                                        postsLoading={postsLoading}
                                    />
                                    <LinkToCreatePost />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="post=:postId/comments"
                            element={
                                <>
                                    <Navbar
                                        categories={categories}
                                        categoriesLoading={categoriesLoading}
                                        categoryLoadingError={
                                            categoryLoadingError
                                        }
                                    />
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
                                    <Navbar
                                        categories={categories}
                                        categoriesLoading={categoriesLoading}
                                        categoryLoadingError={
                                            categoryLoadingError
                                        }
                                    />
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
                                    <Navbar
                                        categories={categories}
                                        categoriesLoading={categoriesLoading}
                                        categoryLoadingError={
                                            categoryLoadingError
                                        }
                                    />
                                    <CreatePost
                                        categories={categories}
                                        addPost={addPost}
                                    />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/create-category/"
                            element={
                                <>
                                    <Navbar
                                        categories={categories}
                                        categoriesLoading={categoriesLoading}
                                        categoryLoadingError={
                                            categoryLoadingError
                                        }
                                    />
                                    <CreateCategory addCategory={addCategory} />
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
