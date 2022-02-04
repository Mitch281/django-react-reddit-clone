import { Link, useParams, useLocation } from "react-router-dom";

const OrderOptions = () => {
    const params = useParams();
    const { state } = useLocation();
    const categoryName = params.categoryName;
    const order = params.order;

    function getOutput() {
        if (categoryName && !order) {
            return (
                <div id="post-sorting-options-flex-container">
                    <div id="post-sorting-options">
                        <span>Sort by: </span>
                        <Link
                            to="new/"
                            state={{ categoryId: state.categoryId }}
                            id={order === "new" ? "current-ordering" : ""}
                        >
                            New
                        </Link>
                        <Link
                            to="old/"
                            state={{ categoryId: state.categoryId }}
                            id={order === "old" ? "current-ordering" : ""}
                        >
                            Old
                        </Link>
                        <Link
                            to="top/"
                            state={{ categoryId: state.categoryId }}
                            id={order === "top" ? "current-ordering" : ""}
                        >
                            Top
                        </Link>
                        <Link
                            to="bottom/"
                            state={{ categoryId: state.categoryId }}
                            id={
                                order === "bottom"
                                    ? "current-ordering"
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
                <div id="post-sorting-options-flex-container">
                    <div id="post-sorting-options">
                        <span>Sort by: </span>
                        <Link
                            to={`/posts/category=${categoryName}/new/`}
                            state={{ categoryId: state.categoryId }}
                            id={order === "new" ? "current-ordering" : ""}
                        >
                            New
                        </Link>
                        <Link
                            to={`/posts/category=${categoryName}/old/`}
                            state={{ categoryId: state.categoryId }}
                            id={order === "old" ? "current-ordering" : ""}
                        >
                            Old
                        </Link>
                        <Link
                            to={`/posts/category=${categoryName}/top/`}
                            state={{ categoryId: state.categoryId }}
                            id={order === "top" ? "current-ordering" : ""}
                        >
                            Top
                        </Link>
                        <Link
                            to={`/posts/category=${categoryName}/bottom/`}
                            state={{ categoryId: state.categoryId }}
                            id={
                                order === "bottom"
                                    ? "current-ordering"
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
                <div id="post-sorting-options-flex-container">
                    <div id="post-sorting-options">
                        <span>Sort by: </span>
                        <Link
                            to="/new/"
                            id={order === "new" ? "current-ordering" : ""}
                        >
                            New
                        </Link>
                        <Link
                            to="/old/"
                            id={order === "old" ? "current-ordering" : ""}
                        >
                            Old
                        </Link>
                        <Link
                            to="/top/"
                            id={order === "top" ? "current-ordering" : ""}
                        >
                            Top
                        </Link>
                        <Link
                            to="/bottom/"
                            id={
                                order === "bottom"
                                    ? "current-ordering"
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
