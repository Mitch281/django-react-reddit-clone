import PropTypes from "prop-types";
import styles from "./title.module.css";

const Title = (props) => {
    return (
        <h1 className={styles["post-title"]}>
            {props.title}
        </h1>
    )
}

Title.propTypes = {
    title: PropTypes.string
}

export default Title
