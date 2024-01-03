import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EventType } from "./types";

export default function useLocalStorage(
  storageKey: string,
  initialValue: EventType[] | []
): [EventType[], Dispatch<SetStateAction<EventType[]>>] {
  const [value, setValue] = useState<EventType[]>(() => {
    const tempGet = localStorage.getItem(storageKey);
    // see if value for storage key was in local storage
    if (tempGet == null) {
      // if it DOES exist, return that value as initial value
      return initialValue;
    } else {
      // change back to JSON object with JSON.parse()
      return JSON.parse(tempGet, (key, value) => {
        if (key === "date" && typeof value === "string") {
          const parsedDate = new Date(value);
          if (!isNaN(parsedDate.getTime())) {
            return parsedDate;
          }
        }
        return value;
      });
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
