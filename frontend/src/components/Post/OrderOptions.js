import { Link, useParams, useLocation } from "react-router-dom";

const OrderOptions = () => {

    const params = useParams();
    const { state } = useLocation();
    const categoryName = params.categoryName;
    const order = params.order;

    function getOutput() {
        if (categoryName && !order) {
            return (
                <div>
                    <Link to="new/" state={{categoryId: state.categoryId}}>New</Link>
                    <Link to="old/" state={{categoryId: state.categoryId}}>Old</Link>
                    <Link to="top/" state={{categoryId: state.categoryId}}>Top</Link>
                    <Link to="bottom/" state={{categoryId: state.categoryId}}>Bottom</Link>
                </div>
            );
        }
        else if (categoryName && order) {
            return (
                <div>
                    <Link to={`/posts/category=${categoryName}/new/`} state={{categoryId: state.categoryId}}>New</Link>
                    <Link to={`/posts/category=${categoryName}/old/`} state={{categoryId: state.categoryId}}>Old</Link>
                    <Link to={`/posts/category=${categoryName}/top/`} state={{categoryId: state.categoryId}}>Top</Link>
                    <Link to={`/posts/category=${categoryName}/bottom/`} state={{categoryId: state.categoryId}}>Bottom</Link>
                </div>
            );
        }
        else {
            return (
                <div>
                    <Link to="/new/">New</Link>
                    <Link to="/old/">Old</Link>
                    <Link to="/top/">Top</Link>
                    <Link to="/bottom/">Bottom</Link>
                </div>
            );
        }
    }

    return (
        getOutput()
    );
}

export default OrderOptions;
