import { useEffect, useState, useCallback } from "react";

export function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(
        () =>
            (typeof window !== "undefined" &&
                window.localStorage.getItem(key)) ||
            initialValue
    );

    const setItem = (newValue) => {
        setValue(newValue);
        typeof window !== "undefined" &&
            window.localStorage.setItem(key, newValue);
    };

    useEffect(() => {
        const newValue =
            typeof window !== "undefined" && window.localStorage.getItem(key);
        if (value !== newValue) {
            setValue(newValue || initialValue);
        }
    });

    const handleStorage = useCallback(
        (event) => {
            if (event.key === key && event.newValue !== value) {
                setValue(event.newValue || initialValue);
            }
        },
        [value]
    );

    useEffect(() => {
        typeof window !== "undefined" &&
            window.addEventListener("storage", handleStorage);
        return () =>
            typeof window !== "undefined" &&
            window.removeEventListener("storage", handleStorage);
    }, [handleStorage]);

    return [value, setItem];
}
