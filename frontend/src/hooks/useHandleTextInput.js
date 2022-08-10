function useHandleTextInput() {
    return (e, setState, numCharsLeft) => {
        const charEntered = e.nativeEvent.data;
        const inputType = e.nativeEvent.inputType;
        if (numCharsLeft <= 0) {
            if (charEntered || inputType === "insertFromPaste") return;
        }

        setState(e.target.value);
    };
}

export default useHandleTextInput;
