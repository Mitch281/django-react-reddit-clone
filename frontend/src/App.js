import { useState, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Nav/Navbar";
function App() {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
          <Routes>
            <Route exact path="/" element = {
              <>
                <Navbar />
              </>
            }
            />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
