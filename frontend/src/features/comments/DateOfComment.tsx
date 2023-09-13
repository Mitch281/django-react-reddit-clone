import { getTimeElapsedFromCreation } from "../../utils/date-time-functions";
import styles from "./styles/date-of-comment.module.css";

type Props = {
    dateCreated: string;
};

const DateOfComment = ({ dateCreated }: Props) => {
    return (
        <span className={styles["time-elapsed-from-comment"]}>
            {getTimeElapsedFromCreation(dateCreated)}
        </span>
    );
};

export default DateOfComment;
