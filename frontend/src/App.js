import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/Auth/LoginPage";
import SignupPage from "./components/Auth/SignupPage";
import Navbar from "./components/Nav/Navbar";
import Posts from "./components/Home/Posts";
import PostsByCategory from "./components/PostsByCategory/PostsByCategory";
import Comments from "./components/Comments/Comments";
import PostSelected from "./components/Comments/PostSelected";

export const UserContext = createContext();

function App() {
  const [usernameLoggedIn, setUsernameLoggedIn] = useState("");
  const [userIdLoggedIn, setUserIdLoggedIn] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [posts, setPosts] = useState([]);

  // TODO: Catch errors properly.
  async function loadPosts() {
    const response = await fetch("http://localhost:8000/api/posts/");
    if (response.ok) {
      const json = await response.json();
      setPosts(json);
    } else {
      throw new Error("Error loading posts.");
    }
  }

  async function upvote(postId, currentNumUpvotes) {
    const response = await fetch(`http://localhost:8000/api/post/id=${postId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify({num_upvotes: currentNumUpvotes + 1})
    });
    if (response.ok) {
      setPosts(posts.map(post => 
        post.id === postId ? {...post, numUpvotes: currentNumUpvotes + 1} : post
      ));
    } else {
      throw new Error("couldn't upvote!");
    }
  }

  async function loadVotes() {}

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <Router>
      <UserContext.Provider value={
        {usernameLoggedIn,
          userIdLoggedIn,
          loggedIn, 
          setUsernameLoggedIn, 
          setUserIdLoggedIn,
          setLoggedIn}
        }>
        <div className="App">
            <Routes>
              <Route exact path="/" element = {
                <>
                  <Navbar />
                  <Posts posts={posts} upvote={upvote}/>
                </>
              }
              />
              <Route exact path="/login/" element = {
                <>
                  <Navbar />
                  <LoginPage />
                </>
              }
              />
              <Route exact path="/signup/" element = {
                <>
                  <Navbar />
                  <SignupPage />
                </>
              }
              />
              <Route exact path="posts/category=:categoryName" element = {
                <>
                  <Navbar />
                  <PostsByCategory />
                </>
              }
              />
              <Route exact path="post=:postId/comments" element = {
                <>
                  <Navbar />
                  <PostSelected />
                  <Comments />
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
