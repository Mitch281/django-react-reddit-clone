import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/Auth/LoginPage";
import SignupPage from "./components/Auth/SignupPage";
import Navbar from "./components/Nav/Navbar";
import Posts from "./components/Home/Posts";
import PostsByCategory from "./components/PostsByCategory/PostsByCategory";
import Comments from "./components/Comments/Comments";
import PostSelected from "./components/Comments/PostSelected";
import { v4 as uuid_v4 } from "uuid";

export const UserContext = createContext();

function App() {
  const [usernameLoggedIn, setUsernameLoggedIn] = useState("");
  const [userIdLoggedIn, setUserIdLoggedIn] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [posts, setPosts] = useState([]);

  // This keeps track of posts that users have voted on. This is needed to enforce the rule that users can only vote on a post
  // once.
  const [userPostVotes, setUserPostVotes] = useState([]);

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

  async function loadPostVotes() {
    const response = await fetch("http://localhost:8000/api/post-votes/");
    if (response.ok) {
      const json = await response.json();
      setUserPostVotes(json);
    } else {
      throw new Error("Couldn't load user post votes");
    }
  }

  async function upvote(postId, currentNumUpvotes, downvoteAlready) {
    let voteIncrement;
    if (downvoteAlready) {
      voteIncrement = 2;
    } else {
      voteIncrement = 1;
    }
    const response = await fetch(`http://localhost:8000/api/post/id=${postId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify({num_upvotes: currentNumUpvotes + voteIncrement})
    });
    if (response.ok) {
      setPosts(posts.map(post => 
        post.id === postId ? {...post, num_upvotes: currentNumUpvotes + voteIncrement} : post
      ));
    } else {
      throw new Error("couldn't upvote!");
    }
  }

  // Updates the user's votes in the case of an upvote
  async function userPostUpvote(userId, postId, downvoteAlready) {
    console.log("made it");
    let newUserPostVote;
    if (!downvoteAlready) {
      newUserPostVote = {
        id: uuid_v4(),
        upvote: true,
        downvote: false,
        user: userId,
        post: postId
      }
      const response = await fetch("http://localhost:8000/api/post-votes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify(newUserPostVote)
      });
      if (response.ok) {
        setUserPostVotes(userPostVotes => [...userPostVotes, newUserPostVote]);
      } else {
        throw new Error("Couldn't update user post vote.");
      }
    }
  }

  useEffect(() => {
    loadPosts();
    loadPostVotes();
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
                  <Posts posts={posts} upvote={upvote} userPostVotes={userPostVotes} userPostUpvote={userPostUpvote} />
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
                  <PostsByCategory upvote={upvote} userPostVotes={userPostVotes} userPostUpvote={userPostUpvote} />
                </>
              }
              />
              <Route exact path="post=:postId/comments" element = {
                <>
                  <Navbar />
                  <PostSelected upvote={upvote} userPostVotes={userPostVotes} userPostUpvote={userPostUpvote} />
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
