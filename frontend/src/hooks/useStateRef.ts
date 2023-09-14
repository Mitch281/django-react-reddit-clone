import { useEffect, useRef, useState } from "react";

function useStateRef<T>(initialValue: T): React.RefObject<T> {
    const [value, setValue] = useState(initialValue);

    const ref = useRef<T>(value);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref;
}

export default useStateRef;
