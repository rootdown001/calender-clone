import { useEffect, useState } from "react";

export default function useLocalStorage(storageKey, initialValue) {
  const [value, setValue] = useState(() => {
    const tempGet = localStorage.getItem(storageKey);
    // see if value for storage key was in local storage
    if (tempGet == null) {
      // are we passing initial value as function or value
      if (typeof initialValue === "function") {
        return initialValue();
      } else {
        return initialValue;
      }
      // if it DOES exist, return that value as initial value
      // change back to JSON object with JSON.parse()
    } else {
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

  // useEffect(() => {
  //   if (Array.isArray(value)) {
  //     setValue(value);
  //   } else {
  //     setValue([value]);
  //   }
  // }, [value]);

  console.log("value: ", value);
  return [value, setValue];
}
