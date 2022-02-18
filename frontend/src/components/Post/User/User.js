import PropTypes from "prop-types";
import styles from "./user.module.css";

const User = (props) => {
    return (
        <span>
            Posted by <span className={styles["username"]}>{props.username}</span> &nbsp;
        </span>
    )
}

User.propTypes = {
    username: PropTypes.string
}

export default User
