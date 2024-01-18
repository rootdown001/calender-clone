import { useMemo, useState } from "react";
import { EventType } from "./types";
import { format, isBefore, isSameMonth, isToday } from "date-fns";
import CheckExtraEvents from "./CheckExtraEvents";
import ViewMoreModal from "./ViewMoreModal";
import AddEvent from "./AddEvent";

type CalendarDayProps = {
  eventsForDay: EventType[];
  date: Date;
  visibleMonth: Date;
  index: number;
  events: EventType[];
  setEvents: React.Dispatch<React.SetStateAction<EventType[]>>;
};

export default function CalendarDay({
  eventsForDay,
  date,
  visibleMonth,
  index,
  events,
  setEvents,
}: CalendarDayProps) {
  // state for view more modal
  const [isViewMoreOpen, setIsViewMoreOpen] = useState(false);

  // Event Modal
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  // is modal an edit
  const [isModalEdit, setIsModalEdit] = useState(false);
  // event to prefill modal
  const [eventToPass, setEventToPass] = useState<EventType>();

  // date of event to pass to event modal
  const [dateOfEvent, setDateOfEvent] = useState<Date>(new Date());

  function openModal(event: EventType) {
    setIsEventFormOpen(true);
    setIsModalEdit(true);
    setEventToPass(event);
  }

  // useMemo to sort
  const sortEvents = useMemo(() => {
    return eventsForDay.sort((a, b) => {
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
  }, [eventsForDay]);

  return (
    <div
      key={date.toDateString()}
      className={`day ${!isSameMonth(date, visibleMonth) && "non-month-day"} ${
        isBefore(
          format(date, "MM/dd/yyyy"),
          format(new Date(), "MM/dd/yyyy")
        ) && "old-month-day"
      }`}
    >
      <div className="day-header">
        <div className="week-name">{index < 7 && format(date, "EE")}</div>
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
      {sortEvents.length > 0 && (
        <CheckExtraEvents
          eventsToRender={sortEvents}
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
                eventsForDay={eventsForDay}
                openModal={openModal}
                isOpen={isViewMoreOpen}
                onClose={() => setIsViewMoreOpen(false)}
              />
            </>
          )}
        />
      )}
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
