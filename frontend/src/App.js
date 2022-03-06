import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/Auth/LoginPage";
import SignupPage from "./components/Auth/SignupPage";
import Navbar from "./components/Nav/Navbar/Navbar";
import Posts from "./components/Post/Posts/Posts";
import PostsByCategory from "./components/Post/PostsByCategory/PostsByCategory";
import Comments from "./components/Comments/Comments/Comments";
import PostSelected from "./components/Comments/PostSelected/PostSelected";
import {
    fetchPosts,
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

    async function loadPosts(order) {
        try {
            const json = await fetchPosts(order);
            setPosts(json);
        } catch (error) {
            throw error;
        }
    }

    async function loadCategories() {
        try {
            const json = await fetchCategories();
            setCategories(json);
        } catch (error) {
            throw error;
        }
    }

    async function loadPostVotes() {
        try {
            const json = await fetchUsersVotesOnPosts();
            setUserPostVotes(json);
        } catch (error) {
            throw error;
        }
    }

    async function upvote(
        postId,
        currentNumUpvotes,
        currentNumDownvotes,
        status,
        thingToUpvote
    ) {
        try {
            await postUpvote(
                postId,
                currentNumUpvotes,
                currentNumDownvotes,
                status,
                thingToUpvote
            );

            // User is going from downvote to upvote.
            if (status === "downvoted") {
                setPosts(
                    posts.map((post) =>
                        post.id === postId
                            ? {
                                  ...post,
                                  num_upvotes: currentNumUpvotes + 1,
                                  num_downvotes: currentNumDownvotes - 1,
                              }
                            : post
                    )
                );
            }

            // User is undoing upvote.
            else if (status === "upvoted") {
                setPosts(
                    posts.map((post) =>
                        post.id === postId
                            ? { ...post, num_upvotes: currentNumUpvotes - 1 }
                            : post
                    )
                );
            }

            // User is going from no vote to upvote.
            else {
                setPosts(
                    posts.map((post) =>
                        post.id === postId
                            ? { ...post, num_upvotes: currentNumUpvotes + 1 }
                            : post
                    )
                );
            }
        } catch (error) {
            throw error;
        }
    }

    // Updates the user's votes in the case of an upvote.
    async function trackUsersUpvotes(
        userId,
        postId,
        status,
        postVoteId,
        thingToUpvote
    ) {
        // User has voted on post already. Thus, postVoteId exists (is not null).
        if (postVoteId) {
            try {
                await patchUsersUpvote(status, postVoteId, thingToUpvote);
                // User is going from downvote to upvote.
                if (status === "downvoted") {
                    setUserPostVotes(
                        userPostVotes.map((userPostVote) =>
                            userPostVote.id === postVoteId
                                ? {
                                      ...userPostVote,
                                      upvote: true,
                                      downvote: false,
                                  }
                                : userPostVote
                        )
                    );
                }

                // User is undoing upvote.
                else if (status === "upvoted") {
                    setUserPostVotes(
                        userPostVotes.map((userPostVote) =>
                            userPostVote.id === postVoteId
                                ? { ...userPostVote, upvote: false }
                                : userPostVote
                        )
                    );
                }

                // User has previously voted before, but has no current vote on the post.
                else {
                    setUserPostVotes(
                        userPostVotes.map((userPostVote) =>
                            userPostVote.id === postVoteId
                                ? { ...userPostVote, upvote: true }
                                : userPostVote
                        )
                    );
                }
            } catch (error) {
                throw error;
            }
        }

        // The user has not voted on the post yet. Thus, we need to post a new vote.
        else {
            try {
                const data = await postUsersUpvote(
                    userId,
                    postId,
                    thingToUpvote
                );
                setUserPostVotes((userPostVotes) => [...userPostVotes, data]);
            } catch (error) {
                throw error;
            }
        }
    }

    async function downvote(
        postId,
        currentNumUpvotes,
        currentNumDownvotes,
        status,
        thingToDownvote
    ) {
        try {
            await postDownvote(
                postId,
                currentNumUpvotes,
                currentNumDownvotes,
                status,
                thingToDownvote
            );

            // User is undoing downvote by downvoting again.
            if (status === "downvoted") {
                setPosts(
                    posts.map((post) =>
                        post.id === postId
                            ? {
                                  ...post,
                                  num_downvotes: currentNumDownvotes - 1,
                              }
                            : post
                    )
                );
            }

            // User is going from upvote to downvote
            else if (status === "upvoted") {
                setPosts(
                    posts.map((post) =>
                        post.id === postId
                            ? {
                                  ...post,
                                  num_upvotes: currentNumUpvotes - 1,
                                  num_downvotes: currentNumDownvotes + 1,
                              }
                            : post
                    )
                );
            }

            // User is going from no vote to downote.
            else {
                setPosts(
                    posts.map((post) =>
                        post.id === postId
                            ? {
                                  ...post,
                                  num_downvotes: currentNumDownvotes + 1,
                              }
                            : post
                    )
                );
            }
        } catch (error) {
            throw error;
        }
    }

    async function trackUsersDownvotes(
        userId,
        postId,
        status,
        postVoteId,
        thingToDownvote
    ) {
        // User has voted on the post before.
        if (postVoteId) {
            try {
                await patchUsersDownvote(status, postVoteId, thingToDownvote);

                // User is undoing downvote by downvoting again.
                if (status === "downvoted") {
                    setUserPostVotes(
                        userPostVotes.map((userPostVote) =>
                            userPostVote.id === postVoteId
                                ? { ...userPostVote, downvote: false }
                                : userPostVote
                        )
                    );

                    // User is going from upvote to downvote.
                } else if (status === "upvoted") {
                    setUserPostVotes(
                        userPostVotes.map((userPostVote) =>
                            userPostVote.id === postVoteId
                                ? {
                                      ...userPostVote,
                                      upvote: false,
                                      downvote: true,
                                  }
                                : userPostVote
                        )
                    );

                    // User has previously voted before, but has no current vote on the post.
                } else {
                    setUserPostVotes(
                        userPostVotes.map((userPostVote) =>
                            userPostVote.id === postVoteId
                                ? { ...userPostVote, downvote: true }
                                : userPostVote
                        )
                    );
                }
            } catch (error) {
                throw error;
            }
        }

        // User has not voted on post yet.
        else {
            try {
                const data = await postUsersDownvote(
                    userId,
                    postId,
                    thingToDownvote
                );
                setUserPostVotes((userPostVotes) => [...userPostVotes, data]);
            } catch (error) {
                throw error;
            }
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

    async function getPosts() {
        setPostsLoading(true);
        try {
            await loadPosts("");
        } catch (error) {
            setPostLoadingError(error);
        } finally {
            setPostsLoading(false);
        }
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
    
    async function getPostVotes() {
        try {
            await loadPostVotes();
        } catch (error) {
            throw error;
        }
    }

    // Load posts on page load.
    useEffect(() => {
        getPosts();
        // eslint-disable-next-line
    }, []);

    // Load categories on page load.
    useEffect(() => {
        getCategories();
        // eslint-disable-next-line
    }, []);

    // Load post votes on page load.
    useEffect(() => {
        getPostVotes();
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
                                        posts={posts}
                                        loadPosts={loadPosts}
                                        upvote={upvote}
                                        userPostVotes={userPostVotes}
                                        trackUsersUpvotes={trackUsersUpvotes}
                                        downvote={downvote}
                                        trackUsersDownvotes={
                                            trackUsersDownvotes
                                        }
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
                                        posts={posts}
                                        loadPosts={loadPosts}
                                        upvote={upvote}
                                        userPostVotes={userPostVotes}
                                        trackUsersUpvotes={trackUsersUpvotes}
                                        downvote={downvote}
                                        trackUsersDownvotes={
                                            trackUsersDownvotes
                                        }
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
                                    <PostsByCategory
                                        posts={posts}
                                        upvote={upvote}
                                        userPostVotes={userPostVotes}
                                        trackUsersUpvotes={trackUsersUpvotes}
                                        downvote={downvote}
                                        trackUsersDownvotes={
                                            trackUsersDownvotes
                                        }
                                        deletePost={deletePost}
                                        editPostContent={editPostContent}
                                        postsLoading={postsLoading}
                                        postsLoadingError={postLoadingError}
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
                                    <PostsByCategory
                                        posts={posts}
                                        upvote={upvote}
                                        userPostVotes={userPostVotes}
                                        trackUsersUpvotes={trackUsersUpvotes}
                                        downvote={downvote}
                                        trackUsersDownvotes={
                                            trackUsersDownvotes
                                        }
                                        deletePost={deletePost}
                                        editPostContent={editPostContent}
                                        postsLoading={postsLoading}
                                        postsLoadingError={postLoadingError}
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
                                    <PostSelected
                                        posts={posts} // We only pass this as a props so that any change to the post selected will render without page refresh.
                                        upvote={upvote}
                                        userPostVotes={userPostVotes}
                                        trackUsersUpvotes={trackUsersUpvotes}
                                        downvote={downvote}
                                        trackUsersDownvotes={
                                            trackUsersDownvotes
                                        }
                                        deletePost={deletePost}
                                        editPostContent={editPostContent}
                                        postsLoading={postsLoading}
                                        postsLoadingError={postLoadingError}
                                    />
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
                                    <PostSelected
                                        posts={posts} // We only pass this as a props so that any change to the post selected will render without page refresh.
                                        upvote={upvote}
                                        userPostVotes={userPostVotes}
                                        trackUsersUpvotes={trackUsersUpvotes}
                                        downvote={downvote}
                                        trackUsersDownvotes={
                                            trackUsersDownvotes
                                        }
                                        deletePost={deletePost}
                                        editPostContent={editPostContent}
                                        postsLoading={postsLoading}
                                        postsLoadingError={postLoadingError}
                                    />
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
