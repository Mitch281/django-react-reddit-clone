import { Link, useParams, useLocation } from "react-router-dom";
import styles from "./order-options.module.css";

const OrderOptions = () => {
    const params = useParams();
    const order = params.order;
    const postId = params.postId;

    const { state, pathname } = useLocation();
    const categoryName = params.categoryName;
    function getPostOrderingOutput() {
        if (categoryName && !order) {
            return (
                <div id={styles["sorting-options-flex-container"]}>
                    <div id={styles["sorting-options"]}>
                        <span>Sort by: </span>
                        <Link
                            to="new/"
                            state={{ categoryId: state.categoryId }}
                            id={
                                order === "new"
                                    ? styles["current-ordering"]
                                    : ""
                            }
                        >
                            New
                        </Link>
                        <Link
                            to="old/"
                            state={{ categoryId: state.categoryId }}
                            id={
                                order === "old"
                                    ? styles["current-ordering"]
                                    : ""
                            }
                        >
                            Old
                        </Link>
                        <Link
                            to="top/"
                            state={{ categoryId: state.categoryId }}
                            id={
                                order === "top"
                                    ? styles["current-ordering"]
                                    : ""
                            }
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
                <div id={styles["sorting-options-flex-container"]}>
                    <div id={styles["sorting-options"]}>
                        <span>Sort by: </span>
                        <Link
                            to={`/posts/category=${categoryName}/new/`}
                            state={{ categoryId: state.categoryId }}
                            id={
                                order === "new"
                                    ? styles["current-ordering"]
                                    : ""
                            }
                        >
                            New
                        </Link>
                        <Link
                            to={`/posts/category=${categoryName}/old/`}
                            state={{ categoryId: state.categoryId }}
                            id={
                                order === "old"
                                    ? styles["current-ordering"]
                                    : ""
                            }
                        >
                            Old
                        </Link>
                        <Link
                            to={`/posts/category=${categoryName}/top/`}
                            state={{ categoryId: state.categoryId }}
                            id={
                                order === "top"
                                    ? styles["current-ordering"]
                                    : ""
                            }
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
        }

        return (
            <div id={styles["sorting-options-flex-container"]}>
                <div id={styles["sorting-options"]}>
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
                            order === "bottom" ? styles["current-ordering"] : ""
                        }
                    >
                        Bottom
                    </Link>
                </div>
            </div>
        );
    }

    function getCommentOrderingOutput() {
        if (!order) {
            return (
                <div id={styles["sorting-options-flex-container"]}>
                    <div id={styles["sorting-options"]}>
                        <span>Sort by: </span>
                        <Link
                            to="new/"
                            id={
                                order === "new"
                                    ? styles["current-ordering"]
                                    : ""
                            }
                        >
                            New
                        </Link>
                        <Link
                            to="old/"
                            id={
                                order === "old"
                                    ? styles["current-ordering"]
                                    : ""
                            }
                        >
                            Old
                        </Link>
                        <Link
                            to="top/"
                            id={
                                order === "top"
                                    ? styles["current-ordering"]
                                    : ""
                            }
                        >
                            Top
                        </Link>
                        <Link
                            to="bottom/"
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

        return (
            <div id={styles["sorting-options-flex-container"]}>
                <div id={styles["sorting-options"]}>
                    <span>Sort by: </span>
                    <Link
                        to={`/post=${postId}/comments/new/`}
                        id={order === "new" ? styles["current-ordering"] : ""}
                    >
                        New
                    </Link>
                    <Link
                        to={`/post=${postId}/comments/old/`}

                        id={order === "old" ? styles["current-ordering"] : ""}
                    >
                        Old
                    </Link>
                    <Link
                        to={`/post=${postId}/comments/top/`}
                        id={order === "top" ? styles["current-ordering"] : ""}
                    >
                        Top
                    </Link>
                    <Link
                        to={`/post=${postId}/comments/bottom/`}
                        id={
                            order === "bottom" ? styles["current-ordering"] : ""
                        }
                    >
                        Bottom
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {pathname.includes("comments")
                ? getCommentOrderingOutput()
                : getPostOrderingOutput()}
        </>
    );
};

export default OrderOptions;
