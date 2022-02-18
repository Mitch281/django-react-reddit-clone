import { Link, useParams, useLocation } from "react-router-dom";
import styles from "./order-options.module.css";

const OrderOptions = () => {
    const params = useParams();
    const { state } = useLocation();
    const categoryName = params.categoryName;
    const order = params.order;

    function getOutput() {
        if (categoryName && !order) {
            return (
                <div id={styles["post-sorting-options-flex-container"]}>
                    <div id={styles["post-sorting-options"]}>
                        <span>Sort by: </span>
                        <Link
                            to="new/"
                            state={{ categoryId: state.categoryId }}
                            id={order === "new" ? styles["current-ordering"] : ""}
                        >
                            New
                        </Link>
                        <Link
                            to="old/"
                            state={{ categoryId: state.categoryId }}
                            id={order === "old" ? styles["current-ordering"] : ""}
                        >
                            Old
                        </Link>
                        <Link
                            to="top/"
                            state={{ categoryId: state.categoryId }}
                            id={order === "top" ? styles["current-ordering"] : ""}
                        >
                            Top
                        </Link>
                        <Link
                            to="bottom/"
                            state={{ categoryId: state.categoryId }}
                            id={
                                order === "bottom"
                                    ? styles["current-ordering"]
                                    : ""
                            }
                        >
                            Bottom
                        </Link>
                    </div>
                </div>
            );
        } else if (categoryName && order) {
            return (
                <div id={styles["post-sorting-options-flex-container"]}>
                    <div id={styles["post-sorting-options"]}>
                        <span>Sort by: </span>
                        <Link
                            to={`/posts/category=${categoryName}/new/`}
                            state={{ categoryId: state.categoryId }}
                            id={order === "new" ? styles["current-ordering"] : ""}
                        >
                            New
                        </Link>
                        <Link
                            to={`/posts/category=${categoryName}/old/`}
                            state={{ categoryId: state.categoryId }}
                            id={order === "old" ? styles["current-ordering"] : ""}
                        >
                            Old
                        </Link>
                        <Link
                            to={`/posts/category=${categoryName}/top/`}
                            state={{ categoryId: state.categoryId }}
                            id={order === "top" ? styles["current-ordering"] : ""}
                        >
                            Top
                        </Link>
                        <Link
                            to={`/posts/category=${categoryName}/bottom/`}
                            state={{ categoryId: state.categoryId }}
                            id={
                                order === "bottom"
                                    ? styles["current-ordering"]
                                    : ""
                            }
                        >
                            Bottom
                        </Link>
                    </div>
                </div>
            );
        } else {
            return (
                <div id={styles["post-sorting-options-flex-container"]}>
                    <div id={styles["post-sorting-options"]}>
                        <span>Sort by: </span>
                        <Link
                            to="/new/"
                            id={order === "new" ? styles["current-ordering"] : ""}
                        >
                            New
                        </Link>
                        <Link
                            to="/old/"
                            id={order === "old" ? styles["current-ordering"] : ""}
                        >
                            Old
                        </Link>
                        <Link
                            to="/top/"
                            id={order === "top" ? styles["current-ordering"] : ""}
                        >
                            Top
                        </Link>
                        <Link
                            to="/bottom/"
                            id={
                                order === "bottom"
                                    ? styles["current-ordering"]
                                    : ""
                            }
                        >
                            Bottom
                        </Link>
                    </div>
                </div>
            );
        }
    }

    return getOutput();
};

export default OrderOptions;