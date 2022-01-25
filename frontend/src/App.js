import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/Auth/LoginPage";
import SignupPage from "./components/Auth/SignupPage";
import Navbar from "./components/Nav/Navbar";
import Posts from "./components/Home/Posts";
import PostsByCategory from "./components/PostsByCategory/PostsByCategory";
import Comments from "./components/Comments/Comments";
import PostSelected from "./components/Comments/PostSelected";
import { postUpvoteToPost, 
        patchUsersUpvote, 
        postUsersUpvote, 
        postDownvoteToPost,  
        patchUsersDownvote, 
        postUsersDownvote 
} 
from "./fetch-data";
import CreateCategory from "./components/CreationForms/CreateCategory";
import CreatePost from "./components/CreationForms/CreatePost";
import LinkToCreatePost from "./components/Home/LinkToCreatePost";

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

  // This function relogs in a user whenever they navigate to a different page or refresh the page.
  async function reLogin() {
    const response = await fetch("http://localhost:8000/api/current-user/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    if (response.ok) {
      const json = await response.json();
      setLoggedIn(true);
      setUserIdLoggedIn(json.id);
      setUsernameLoggedIn(json.username);
    } else {
      throw new Error("Can't relogin!");
    }
  }

  useEffect(() => {
    reLogin();
  }, []);

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

  async function loadCategories() {
    const response = await fetch("http://localhost:8000/api/categories");
    if (response.ok) {
        const json = await response.json();
        setCategories(json);
    } else {
        throw new Error("error loading categories.");
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

  async function upvote(postId, currentNumUpvotes, currentNumDownvotes, status) {
    const upvoted = await postUpvoteToPost(postId, currentNumUpvotes, currentNumDownvotes, status);
    if (upvoted) {

      // User is going from downvote to upvote.
      if (status === "downvoted") {
        setPosts(posts.map(post => 
          post.id === postId ? {...post, num_upvotes: currentNumUpvotes + 1, num_downvotes: currentNumDownvotes - 1} : post
          ));
      }

      // User is undoing upvote.
      else if (status === "upvoted") {
        setPosts(posts.map(post => 
          post.id === postId ? {...post, num_upvotes: currentNumUpvotes - 1} : post
          ));
      } 

      // User is going from no vote to upvote.
      else {
        setPosts(posts.map(post => 
          post.id === postId ? {...post, num_upvotes: currentNumUpvotes + 1} : post
        ));
      }
    } else {
      throw new Error("couldn't upvote!");
    }
  }

  // Updates the user's votes in the case of an upvote.
  async function userPostUpvote(userId, postId, status, postVoteId) {

    // User has voted on post already. Thus, postVoteId exists (is not null).
    if (postVoteId) {
      const patchedUsersUpvote = await patchUsersUpvote(status, postVoteId);
      if (patchedUsersUpvote) {

        // User is going from downvote to upvote.
        if (status === "downvoted") {
          setUserPostVotes(userPostVotes.map(userPostVote => 
            userPostVote.id === postVoteId ? {...userPostVote, upvote: true, downvote: false} : userPostVote
            ));

        // User is undoing upvote.
        } else if (status === "upvoted") {
          setUserPostVotes(userPostVotes.map(userPostVote => 
            userPostVote.id === postVoteId ? {...userPostVote, upvote: false} : userPostVote
            ));

        // User has previously voted before, but has no current vote on the post.
        } else {
          setUserPostVotes(userPostVotes.map(userPostVote => 
            userPostVote.id === postVoteId ? {...userPostVote, upvote: true} : userPostVote));
        }
      } else {
        throw new Error("Couldn't upvote and undo downvote.");
      }
    }

    // The user has not voted on the post yet. Thus, we need to post a new vote.
    else {
      const usersUpvotePosted = await postUsersUpvote(userId, postId);
      if (usersUpvotePosted.result) {
        const data = usersUpvotePosted.data;
        setUserPostVotes(userPostVotes => [...userPostVotes, data]);
      } else {
        throw new Error("Couldn't update user post vote.");
      }
    } 
  }

  async function downvote(postId, currentNumUpvotes, currentNumDownvotes, status) {
    const downvoted = await postDownvoteToPost(postId, currentNumUpvotes, currentNumDownvotes, status);
    if (downvoted) {
      
      // User is undoing downvote by downvoting again.
      if (status === "downvoted") {
        setPosts(posts.map(post => 
          post.id === postId ? {...post, num_downvotes: currentNumDownvotes - 1}: post));
      }

      // User is going from upvote to downvote
      else if (status === "upvoted") {
        setPosts(posts.map(post =>
          post.id === postId ? {...post, num_upvotes: currentNumUpvotes - 1, num_downvotes: currentNumDownvotes + 1} : post));
      }

      // User is going from no vote to downote.
      else {
        setPosts(posts.map(post =>
          post.id === postId ? {...post, num_downvotes: currentNumDownvotes + 1} : post));
      }
    }
    else {
      throw new Error("couldn't downvote.");
    }
  }

  async function userPostDownvote(userId, postId, status, postVoteId) {

    // User has voted on the post before.
    if (postVoteId) {
      const patchedUsersDownvote = await patchUsersDownvote(status, postVoteId);

      if (patchedUsersDownvote) {

        // User is undoing downvote by downvoting again.
        if (status === "downvoted") {
          setUserPostVotes(userPostVotes.map(userPostVote => 
            userPostVote.id === postVoteId ? {...userPostVote, downvote: false} : userPostVote
            ));

        // User is going from upvote to downvote.
        } else if (status === "upvoted") {
          setUserPostVotes(userPostVotes.map(userPostVote => 
            userPostVote.id === postVoteId ? {...userPostVote, upvote: false, downvote: true} : userPostVote
            ));

        // User has previously voted before, but has no current vote on the post.
        } else {
          setUserPostVotes(userPostVotes.map(userPostVote => 
            userPostVote.id === postVoteId ? {...userPostVote, downvote: true} : userPostVote));
        }
      } else {
        throw new Error("Couldn't patch user's downvote");
      }
    }

    // User has not voted on post yet.
    else {
      const usersDownvotePosted = await postUsersDownvote(userId, postId);
      if (usersDownvotePosted.result) {
        const data = usersDownvotePosted.data;
        setUserPostVotes(userPostVotes => [...userPostVotes, data]);
      } else {
        throw new Error("Couldn't update user post vote.");
      }
    } 
  }

  function addPost(newPost) {
    setPosts(posts => [...posts, newPost]);
  }

  function addCategory(newCategory) {
    setCategories(categories => [...categories, newCategory]);
  }

  useEffect(() => {
    loadPosts();
    loadPostVotes();
    loadCategories();
  }, []);

  return (
    <Router>
      <UserContext.Provider value={
        {usernameLoggedIn,
          userIdLoggedIn,
          loggedIn, 
          setUsernameLoggedIn, 
          setUserIdLoggedIn,
          setLoggedIn,
          reLogin}
        }>
        <div className="App">
            <Routes>
              <Route exact path="/" element = {
                <>
                  <Navbar categories={categories} />
                  <Posts posts={posts} 
                  upvote={upvote} 
                  userPostVotes={userPostVotes} 
                  userPostUpvote={userPostUpvote} 
                  downvote={downvote}
                  userPostDownvote={userPostDownvote} />
                  <LinkToCreatePost />
                </>
              }
              />
              <Route exact path="/login/" element = {
                <>
                  <Navbar categories={categories} />
                  <LoginPage />
                </>
              }
              />
              <Route exact path="/signup/" element = {
                <>
                  <Navbar categories={categories} />
                  <SignupPage />
                </>
              }
              />
              <Route exact path="posts/category=:categoryName" element = {
                <>
                  <Navbar categories={categories} />
                  <PostsByCategory upvote={upvote} 
                  userPostVotes={userPostVotes} 
                  userPostUpvote={userPostUpvote} 
                  downvote={downvote}
                  userPostDownvote={userPostDownvote}
                  />
                </>
              }
              />
              <Route exact path="post=:postId/comments" element = {
                <>
                  <Navbar categories={categories} />
                  <PostSelected
                  posts={posts} // We only pass this as a props so that any change to the post selected will render without page refresh.
                  upvote={upvote} 
                  userPostVotes={userPostVotes} 
                  userPostUpvote={userPostUpvote} 
                  downvote={downvote}
                  userPostDownvote={userPostDownvote}
                  />
                  <Comments />
                </>
              }
              />
              <Route exact path="/create-post/" element={
                <>
                  <Navbar categories={categories} />
                  <CreatePost categories={categories} addPost={addPost} />
                </>
              }
              />
              <Route exact path="/create-category/" element={
                <>
                  <Navbar categories={categories} />
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
