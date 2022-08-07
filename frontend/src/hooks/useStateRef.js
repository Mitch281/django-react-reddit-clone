import { useEffect, useRef, useState } from "react";

function useStateRef(initialValue) {
    const [value, setValue] = useState(initialValue);

    const ref = useRef(value);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref;
}

export default useStateRef;
