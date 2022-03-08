import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import styles from "./link-to-create-post.module.css";

const LinkToCreatePost = () => {
    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener("resize", handleWindowSizeChange);
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };
    }, []);

    const isMobile = width <= 768;

    return (
        <>
            {isMobile ? (
                <Link to="/create-post/" id={styles["link-to-create-post"]}>
                    <IoMdAdd size={25}/>
                </Link>
            ) : (
                <Link to="/create-post/" id={styles["link-to-create-post"]}>
                    <IoMdAdd /> Add Post
                </Link>
            )}
        </>
    );
};

export default LinkToCreatePost;
