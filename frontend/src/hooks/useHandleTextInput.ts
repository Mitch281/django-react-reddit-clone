import { SetStateAction } from "react";

function useHandleTextInput() {
    return (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        setState: React.Dispatch<SetStateAction<string>>,
        numCharsLeft: number
    ) => {
        const charEntered = (e.nativeEvent as InputEvent).data;
        const inputType = (e.nativeEvent as InputEvent).inputType;
        if (numCharsLeft <= 0) {
            if (charEntered || inputType === "insertFromPaste") return;
        }

        setState(e.target.value);
    };
}

export default useHandleTextInput;
