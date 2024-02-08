import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfWeek,
  subMonths,
  addMonths,
  isSameDay,
  subDays,
  addDays,
} from "date-fns";
import { startOfMonth } from "date-fns/fp";
import { useMemo, useState } from "react";
import { EventType } from "./types";

import useLocalStorage from "./useLocalStorage";

import CalendarDay from "./CalendarDay";

// TODO: reorganzie to useMemo

export default function Calendar() {
  //   Calander Hooks
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const visibleDates: Date[] = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(visibleMonth)),
      end: endOfWeek(endOfMonth(visibleMonth)),
    });
  }, [visibleMonth]);

  const dateForSample = startOfMonth(visibleMonth);
  // console.log("🚀 ~ Calendar ~ dateForSample:", dateForSample);

  const sampleData: EventType[] = [
    {
      id: "6f456f47-e036-45c2-8646-b946c524d5a1",
      name: "Dinner Out",
      allDay: false,
      startTime: "20:30",
      endTime: "22:00",
      color: "blue",
      date: subDays(dateForSample, 2),
    },
    {
      id: "62c37cd4-8614-41d7-a64f-f481fb20e81f",
      name: "Camping",
      allDay: true,
      startTime: "",
      endTime: "",
      color: "green",
      date: dateForSample,
    },
    {
      id: "876bfcbb-52dc-4d48-851f-33c3ad752600",
      name: "Camping",
      allDay: true,
      startTime: "",
      endTime: "",
      color: "green",
      date: addDays(dateForSample, 1),
    },
    {
      id: "e648d90f-ca11-4a95-b5df-fc199834ae28",
      name: "Camping",
      allDay: true,
      startTime: "",
      endTime: "",
      color: "green",
      date: addDays(dateForSample, 2),
    },
    {
      id: "cd8e2b36-c6ea-4db4-98cb-57906b5ffbde",
      name: "Dental Appt",
      allDay: false,
      startTime: "09:00",
      endTime: "10:00",
      color: "red",
      date: addDays(dateForSample, 4),
    },
    {
      id: "f7f16a60-4d54-4272-9ba3-ab0d6e5d9bfd",
      name: "Doc Appt",
      allDay: false,
      startTime: "11:30",
      endTime: "12:20",
      color: "red",
      date: addDays(dateForSample, 4),
    },
    {
      id: "ed47f955-143b-4334-b2eb-2bf04a93e181",
      name: "Jury Duty",
      allDay: true,
      startTime: "",
      endTime: "",
      color: "blue",
      date: addDays(dateForSample, 6),
    },
    {
      id: "d35c2fd5-81d9-4e28-9772-6631dd484d66",
      name: "Jury Duty",
      allDay: true,
      startTime: "",
      endTime: "",
      color: "blue",
      date: addDays(dateForSample, 7),
    },
    {
      id: "9dc90696-8938-45dc-a619-78b4bfbbc2e6",
      name: "Kids Pizza Party",
      allDay: false,
      startTime: "19:00",
      endTime: "22:00",
      color: "green",
      date: addDays(dateForSample, 6),
    },
    {
      id: "fb009aa6-d244-414c-8e47-600449d35657",
      name: "Groceries",
      allDay: false,
      startTime: "08:00",
      endTime: "09:00",
      color: "green",
      date: addDays(dateForSample, 9),
    },
    {
      id: "bf1e0adf-5479-446a-8948-d2c7e8e0938b",
      name: "Post Office",
      allDay: false,
      startTime: "09:30",
      endTime: "10:00",
      color: "green",
      date: addDays(dateForSample, 9),
    },
    {
      id: "17e7ad74-f441-4183-9da3-6e300aa96bcd",
      name: "Lunch",
      allDay: false,
      startTime: "11:30",
      endTime: "13:00",
      color: "blue",
      date: addDays(dateForSample, 9),
    },
    {
      id: "6b64562a-3f19-49e9-86a1-06e7d98d7c28",
      name: "Haircut",
      allDay: false,
      startTime: "14:10",
      endTime: "14:50",
      color: "blue",
      date: addDays(dateForSample, 9),
    },
    {
      id: "960d030e-e21a-4f20-9060-df8365fadd80",
      name: "Staycation",
      allDay: true,
      startTime: "",
      endTime: "",
      color: "green",
      date: addDays(dateForSample, 11),
    },
    {
      id: "33232213-e02a-4b6b-b838-4b690a947553",
      name: "Staycation",
      allDay: true,
      startTime: "",
      endTime: "",
      color: "green",
      date: addDays(dateForSample, 12),
    },
    {
      id: "f2d5e433-ffbb-4463-a444-9f1aa9d05365",
      name: "Parents Visit",
      allDay: true,
      startTime: "",
      endTime: "",
      color: "red",
      date: addDays(dateForSample, 28),
    },
    {
      id: "bea41550-76eb-46bf-9cc1-68117321bf99",
      name: "Parents Leave",
      allDay: true,
      startTime: "",
      endTime: "",
      color: "red",
      date: addDays(dateForSample, 29),
    },
    {
      id: "d4189c0a-c2b7-4df3-8b57-17bca5d3dde7",
      name: "Parents Arrive",
      allDay: true,
      startTime: "",
      endTime: "",
      color: "red",
      date: addDays(dateForSample, 27),
    },
    {
      id: "511a7452-3eee-4bfd-9daf-42bef1a574ca",
      name: "Basketball Game",
      allDay: false,
      startTime: "16:00",
      endTime: "18:00",
      color: "red",
      date: addDays(dateForSample, 19),
    },
    {
      id: "2f52c2c2-de36-4388-9d27-ec2d9270b004",
      name: "Breakfast Meeting",
      allDay: false,
      startTime: "08:30",
      endTime: "10:00",
      color: "red",
      date: addDays(dateForSample, 20),
    },
    {
      id: "1759f631-8347-402d-a8b0-1351ba5b97c2",
      name: "Eye Appt",
      allDay: false,
      startTime: "13:00",
      endTime: "14:00",
      color: "blue",
      date: addDays(dateForSample, 20),
    },
    {
      id: "12d5d4d6-4102-42d2-ae51-7e1f5d9edda2",
      name: "Vet",
      allDay: false,
      startTime: "14:20",
      endTime: "15:20",
      color: "blue",
      date: addDays(dateForSample, 15),
    },
    {
      id: "588b276b-1296-40de-9cf1-a6e7164565d3",
      name: "Brainstorm",
      allDay: true,
      startTime: "",
      endTime: "",
      color: "green",
      date: addDays(dateForSample, 24),
    },
  ];

  console.log(sampleData);

  // Event state
  const [events, setEvents] = useLocalStorage("test5", sampleData);
  // console.log("🚀 ~ Calendar ~ events:", events);

  function showPreviousMonth() {
    setVisibleMonth((currentMonth) => {
      return subMonths(currentMonth, 1);
    });
  }

  function showNextMonth() {
    setVisibleMonth((currentMonth) => {
      return addMonths(currentMonth, 1);
    });
  }

  return (
    <div className="calendar">
      <div className="header">
        <button className="btn" onClick={() => setVisibleMonth(new Date())}>
          Today
        </button>
        <div>
          <button className="month-change-btn" onClick={showPreviousMonth}>
            &lt;
          </button>
          <button className="month-change-btn" onClick={showNextMonth}>
            &gt;
          </button>
        </div>
        <span className="month-title">
          {format(visibleMonth, "MMMM - yyyy")}
        </span>
      </div>
      <div className="days">
        {visibleDates.map((date, index) => {
          return (
            <CalendarDay
              key={date.toDateString()}
              eventsForDay={events.filter((event) => {
                return isSameDay(date, event.date);
              })}
              date={date}
              visibleMonth={visibleMonth}
              index={index}
              events={events}
              setEvents={setEvents}
            />
          );
        })}
      </div>
    </div>
  );
}
