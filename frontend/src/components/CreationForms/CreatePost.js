import { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { v4 as uuid_v4 } from "uuid";
import { getNewAccessTokenIfExpired } from "../../utils/auth";

const CreatePost = (props) => {

    let navigate = useNavigate();

    const {loggedIn, usernameLoggedIn, userIdLoggedIn} = useContext(UserContext);

    useEffect(() => {
        if (!loggedIn) {
            navigate("/login/");
        }
    }, []);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const category = useRef(null);

    async function handleAddPost() {

        const postId = uuid_v4();
        const categoryId = category.current.value.split(",")[0];
        const categoryName = category.current.value.split(",")[1];
        const dateNow = new Date().toString();

        const data = {
            id: postId,
            username: usernameLoggedIn,
            category_name: categoryName,
            title: title,
            content: content,
            num_upvotes: 0,
            num_downvotes: 0,
            date_created: dateNow,
            user: userIdLoggedIn,
            category: categoryId,
        }

        const accessToken = localStorage.getItem("accessToken");
        try {
            await getNewAccessTokenIfExpired(accessToken);
        } catch(error) {
            throw new Error(error);
        }
        const response = await fetch("http://localhost:8000/api/posts/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            props.addPost(data);
            navigate("/"); 
        } else {
            throw new Error(response.status);
        }
    }

    function performAddPost(e) {
        e.preventDefault();

        handleAddPost()
        .catch(error => console.log(error));
    }

    return (
        <div id="create-post-flex-container">
            <form onSubmit={performAddPost} >
                <input type="text" id="post-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                <textarea id="post-content" type="text" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
                <select id="select-post-category" ref={category}> 
                    {props.categories.map(category => 
                    <option key={category.id} value={`${category.id},${category.name}`}>
                        {category.name}
                    </option>)}
                </select>
                <input type="submit" value="Add Post" />
            </form>
        </div>
    );
}

CreatePost.propTypes = {
    categories: PropTypes.array,
    addPost: PropTypes.func
}

export default CreatePost;
