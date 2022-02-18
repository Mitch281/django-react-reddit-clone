import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import styles from "./link-to-create-post.module.css";

const LinkToCreatePost = () => {
    return (
        <Link to="/create-post/" id={styles["link-to-create-post"]}>
            <IoMdAdd /> Add Post
        </Link>
    );
};

export default LinkToCreatePost;
