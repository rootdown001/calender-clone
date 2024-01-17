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
  // Event Modal
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  // is modal an edit
  const [isModalEdit, setIsModalEdit] = useState(false);
  // event to prefill modal
  const [eventToPass, setEventToPass] = useState<EventType>();

  // date of event to pass to event modal
  const [dateOfEvent, setDateOfEvent] = useState<Date>(new Date());

  // state for view more modal
  const [isViewMoreOpen, setIsViewMoreOpen] = useState(false);

  function openModal(event: EventType) {
    setIsEventFormOpen(true);
    setIsModalEdit(true);
    setEventToPass(event);
  }

  function filterArrayByDay(fxnEvents: EventType[], fxnDate: Date) {
    let dayArray = [];
    dayArray = fxnEvents.filter((event) => {
      if (event.date && fxnDate) {
        event.date.setHours(0, 0, 0, 0);
        fxnDate.setHours(0, 0, 0, 0);
        const date1 = event.date.getTime();
        const date2 = fxnDate.getTime();
        if (date1 == date2) {
          return event;
        }
      }
    });

    // function to filter out event array for day then sort
    function sortEvents(dayArray: EventType[]) {
      return dayArray.sort((a, b) => {
        if (a.allDay && !b.allDay) {
          return -1; // `a` should come before `b`
        } else if (!a.allDay && b.allDay) {
          return 1; // `a` should come after `b`
        } else if (!a.allDay && !b.allDay) {
          // If both events are not all-day
          const startTimeA = Number(new Date(a.startTime));
          const startTimeB = Number(new Date(b.startTime));
          return startTimeA - startTimeB; // Compare startTime values
        } else if (a.allDay && b.allDay) {
          // If both events are all-day
          const colorA = a.color;
          const colorB = b.color;
          if (colorA && colorB) {
            return colorA.localeCompare(colorB); // Compare color values
          } else if (colorA) {
            return -1; // `a` should come before `b`
          } else if (colorB) {
            return 1; // `a` should come after `b`
          } else {
            return 0; // No change in order if both events have no color
          }
        } else {
          return 0; // No change in order if both events are all-day
        }
      });
    }
    return sortEvents(dayArray);
  }

  //   Calander Hooks
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const visibleDates: Date[] = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(visibleMonth)),
      end: endOfWeek(endOfMonth(visibleMonth)),
    });
  }, [visibleMonth]);

  // const visibleDates: Date[] = eachDayOfInterval({
  //   start: startOfWeek(startOfMonth(visibleMonth)),
  //   end: endOfWeek(endOfMonth(visibleMonth)),
  // });

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
              </div>
              {filterArrayByDay(events, date).length > 0 && (
                <>
                  <CalendarDay
                    eventsForDay={filterArrayByDay(events, date)}
                    openModal={openModal}
                    renderExtra={(amt) => (
                      <>
                        <button
                          onClick={() => setIsViewMoreOpen(true)}
                          className="events-view-more-btn"
                        >
                          +{amt} More
                        </button>
                        <ViewMoreModal
                          eventsForDay={filterArrayByDay(events, date)}
                          openModal={openModal}
                          isOpen={isViewMoreOpen}
                          onClose={() => setIsViewMoreOpen(false)}
                        />
                      </>
                    )}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      <AddEvent
        dateOfEvent={dateOfEvent}
        isModalEdit={isModalEdit}
        events={events}
        setEvents={setEvents}
        eventToPass={eventToPass}
        isOpen={isEventFormOpen}
        onClose={() => {
          setIsEventFormOpen(false);
          setIsModalEdit(false);
          setEventToPass(undefined);
        }}
      />
    </div>
  );
}
