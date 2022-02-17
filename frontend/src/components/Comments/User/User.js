import PropTypes from "prop-types";
import styles from "./user.module.css";

const User = (props) => {
    return (
        <span className={styles["comment-username"]}>{props.username} &nbsp;</span>
    );
}

User.propTypes = {
    username: PropTypes.string
}

export default User;
