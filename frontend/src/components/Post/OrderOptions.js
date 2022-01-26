import { Link } from "react-router-dom";

const OrderOptions = () => {

    return (
        <div>
            <Link to="/new/">New</Link>
            <Link to="/old/">Old</Link>
            <Link to="/top/">Top</Link>
            <Link to="/bottom/">Bottom</Link>
        </div>
    );
}

export default OrderOptions;
