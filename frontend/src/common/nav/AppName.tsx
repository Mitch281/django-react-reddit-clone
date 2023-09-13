import { Link } from "react-router-dom";
import styles from "./styles/navbar.module.css";

type Props = {
    isMobile: boolean;
};

const AppName = ({ isMobile }: Props) => {
    let content: React.ReactNode = <></>;
    if (!isMobile) {
        content = (
            <Link to="/" id={styles["navbar-site-name"]}>
                <h1>Threddit</h1>
            </Link>
        );
    }
    return content;
};

export default AppName;
