import PropTypes from "prop-types";

const Title = (props) => {
    return (
        <h1 className="post-title">
            {props.title}
        </h1>
    )
}

Title.propTypes = {
    title: PropTypes.string
}

export default Title
