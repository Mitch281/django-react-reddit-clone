import PropTypes from "prop-types";

const User = (props) => {
    return (
        <span>
            Posted by <span className="username">{props.username}</span> &nbsp;
        </span>
    )
}

User.propTypes = {
    username: PropTypes.string
}

export default User
