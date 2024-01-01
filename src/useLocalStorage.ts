import { useEffect, useState } from "react";

export default function useLocalStorage<T>(
  storageKey: string,
  initialValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(() => {
    const tempGet = localStorage.getItem(storageKey);
    // see if value for storage key was in local storage
    if (tempGet == null) {
      // are we passing initial value as function or value
      if (typeof initialValue === "function") {
        return (initialValue as () => T)();
      } else {
        return initialValue;
      }
      // if it DOES exist, return that value as initial value
    } else {
      // change back to JSON object with JSON.parse()
      return JSON.parse(tempGet);
    }
  });

  // when changes, set local storage item to value
  useEffect(() => {
    if (value === undefined) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }
  }, [storageKey, value]);

  console.log("value: ", value);
  return [value, setValue];
}
