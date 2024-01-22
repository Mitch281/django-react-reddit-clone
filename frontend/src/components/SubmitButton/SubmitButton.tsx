import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../utils/constants";
import styles from "./submit-button.module.css";

type Props = {
    value: string;
    apiRequestStatus: "idle" | "pending" | "fulfilled";
    isDisabled: boolean;
};

const SubmitButton = ({ value, apiRequestStatus, isDisabled }: Props) => {
    console.log(apiRequestStatus);
    if (apiRequestStatus === "pending") {
        return (
            <ClipLoader
                color={constants.loaderColour}
                loading={true}
                size={20}
            />
        );
    }

    return (
        <input
            className={styles.input}
            type="Submit"
            value={value}
            disabled={isDisabled}
        />
    );
};
export default SubmitButton;
