import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfWeek,
  isSameMonth,
  isBefore,
  isToday,
  subMonths,
  addMonths,
  isSameDay,
} from "date-fns";
import { startOfMonth } from "date-fns/fp";
import { useDebugValue, useMemo, useState } from "react";
import AddEvent from "./AddEvent";
import useLocalStorage from "./useLocalStorage";
import { EventType } from "./types";
import CalendarDay from "./CalendarDay";
import ViewMoreModal from "./ViewMoreModal";

// TODO: reorganzie to useMemo

export default function Calendar() {
  // Event state
  const [events, setEvents] = useLocalStorage("events", []);
  // console.log("🚀 ~ Calendar ~ events:", events);

  //   Calander Hooks
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const visibleDates: Date[] = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(visibleMonth)),
      end: endOfWeek(endOfMonth(visibleMonth)),
    });
  }, [visibleMonth]);

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
