import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/Auth/LoginPage";
import SignupPage from "./components/Auth/SignupPage";
import Navbar from "./components/Nav/Navbar";
import Posts from "./components/Home/Posts";
import PostsByCategory from "./components/PostsByCategory/PostsByCategory";

function App() {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [posts, setPosts] = useState([]);

  // TODO: Catch errors properly.
  async function loadPosts() {
    const response = await fetch("http://localhost:8000/api/posts");
    if (response.ok) {
      const json = await response.json();
      console.log(json);
      setPosts(json);
    } else {
      throw new Error("Error loading posts.");
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <Router>
      <div className="App">
          <Routes>
            <Route exact path="/" element = {
              <>
                <Navbar />
                <Posts posts={posts} />
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
            <Route path="posts/category=:categoryName" element = {
              <>
                <Navbar />
                <PostsByCategory />
              </>
            }
            />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
