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
  parse,
} from "date-fns";
import { startOfMonth } from "date-fns/fp";
import { useState } from "react";
import AddEvent from "./AddEvent";
import useLocalStorage from "./useLocalStorage";
import { EventType } from "./types";

export default function Calendar() {
  // Event state
  const [events, setEvents] = useLocalStorage("events", []);
  // Event Modal
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  // is modal an edit
  const [isModalEdit, setIsModalEdit] = useState(false);

  // date of event to pass to event modal
  const [dateOfEvent, setDateOfEvent] = useState<Date>(new Date());
  // console.log(
  //   "🚀 ~ file: Calendar.tsx:29 ~ Calendar ~ dateOfEvent:",
  //   typeof dateOfEvent
  // );

  function filterArrayByDay(fxnEvents, fxnDate) {
    let dayArray = [];
    dayArray = fxnEvents.filter((event) => {
      if (event.date && fxnDate) {
        event.date.setHours(0, 0, 0, 0);
        fxnDate.setHours(0, 0, 0, 0);
        const date1 = event.date.getTime();
        const date2 = fxnDate.getTime();
        // console.log(date1 == date2);
        if (date1 == date2) {
          // console.log("event passed: ", event);
          return event;
        }
      }
    });
    console.log("dayArray: ", dayArray);

    function sortEvents(dayArray) {
      return dayArray.sort((a, b) => {
        if (a.allDay && !b.allDay) {
          return -1; // `a` should come before `b`
        } else if (!a.allDay && b.allDay) {
          return 1; // `a` should come after `b`
        } else if (!a.allDay && !b.allDay) {
          // If both events are not all-day
          const startTimeA = new Date(a.startTime);
          const startTimeB = new Date(b.startTime);
          return startTimeA - startTimeB; // Compare startTime values
        } else if (a.allDay && b.allDay) {
          // If both events are all-day
          const colorA = a.color;
          const colorB = b.color;
          return colorA.localeCompare(colorB); // Compare color values
        } else {
          return 0; // No change in order if both events are all-day
        }
      });
    }

    return sortEvents(dayArray);
  }

  //   Calander Hooks
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const visibleDates: Date[] = eachDayOfInterval({
    start: startOfWeek(startOfMonth(visibleMonth)),
    end: endOfWeek(endOfMonth(visibleMonth)),
  });
  //   console.log(
  //     "🚀 ~ file: Calendar.tsx:18 ~ Calendar ~ visibleDates:",
  //     visibleDates
  //   );

  // EventForm functions

  // calander functions

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
            <div
              key={date.toDateString()}
              className={`day ${
                !isSameMonth(date, visibleMonth) && "non-month-day"
              } ${
                isBefore(
                  format(date, "MM/dd/yyyy"),
                  format(new Date(), "MM/dd/yyyy")
                ) && "old-month-day"
              }`}
            >
              <div className="day-header">
                <div className="week-name">
                  {index < 7 && format(date, "EE")}
                </div>
                <div className={`day-number ${isToday(date) && "today"}`}>
                  {format(date, "d")}
                </div>
                <button
                  className="add-event-btn"
                  onClick={() => {
                    setIsEventFormOpen(true);
                    setDateOfEvent(date);
                  }}
                >
                  +
                </button>

                {/* TODO: Fix formatting for left align buttons  */}

                {filterArrayByDay(events, date).map((event: EventType) => {
                  return (
                    <div key={event.id} className="events">
                      {/* all day event */}
                      {event.allDay && (
                        <button
                          className={`all-day-event
           ${event.color == "blue" && "blue"} ${
                            event.color == "green" && "green"
                          } ${event.color == "red" && "red"} event`}
                        >
                          <div className="event-name">{event.name}</div>
                        </button>
                      )}
                      {/* NOT all day event */}
                      {!event.allDay && (
                        <button className="event">
                          <div
                            className={`color-dot ${
                              event.color == "blue" && "blue"
                            } ${event.color == "green" && "green"} ${
                              event.color == "red" && "red"
                            }`}
                          ></div>
                          <div className="event-time">
                            {format(
                              parse(event.startTime, "HH:mm", new Date()),
                              "h:mm aaaaa"
                            )}
                          </div>
                          <div className="event-name">{event.name}</div>
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* end of events */}
              </div>
            </div>
          );
        })}
      </div>
      <AddEvent
        dateOfEvent={dateOfEvent}
        isEventFormOpen={isEventFormOpen}
        isModalEdit={isModalEdit}
        onClose={() => setIsEventFormOpen(false)}
        events={events}
        setEvents={setEvents}
      />
    </div>
  );
}
