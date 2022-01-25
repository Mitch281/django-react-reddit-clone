import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";

const LinkToCreatePost = () => {
    return (
        <Link to="/create-post/" id="link-to-create-post">
            <IoMdAdd /> Add Post
        </Link>
    );
};

export default LinkToCreatePost;
