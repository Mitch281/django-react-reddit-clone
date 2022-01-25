import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";

const CreatePost = (props) => {

    let navigate = useNavigate();

    const {loggedIn} = useContext(UserContext);

    useEffect(() => {
        if (!loggedIn) {
            navigate("/login/");
        }
    }, []);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    return (
        <div id="create-post-flex-container">
            <form>
                <input type="text" id="post-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                <textarea id="post-content" type="text" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
                <select id="select-post-category">
                    <option value="Home">Home</option>
                    {props.categories.map(category => <option value={category.name}>{category.name}</option>)}
                </select>
                <input type="submit" value="Add Post" />
            </form>
        </div>
    );
}

CreatePost.propTypes = {
    categories: propTypes.array
}

export default CreatePost;
