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

  // define event list for individual day
  const [eventsDay, setEventsDay] = useState<EventType[]>([]);

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

                <div className="events">
                  {events.map((event) => {
                    if (event.date && date) {
                      event.date.setHours(0, 0, 0, 0);
                      date.setHours(0, 0, 0, 0);
                      const date1 = event.date.getTime();
                      const date2 = date.getTime();
                      // console.log(date1 == date2);
                      if (date1 == date2) {
                        return (
                          <button key={event.id} className={`event `}>
                            <div className="event-name"> {event.name}</div>
                          </button>
                        );
                      }
                      return null;
                    }
                    return null;
                  })}
                </div>

                {/* figure out events */}
                {/* <div className="events">
                  <button className="all-day-event blue event">
                    <div className="event-name">Short</div>
                  </button>
                  <button className="all-day-event blue event">
                    <div className="event-name">
                      Long Event Name That Just Keeps Going
                    </div>
                  </button>
                  <button className="event">
                    <div className="color-dot blue"></div>
                    <div className="event-time">7am</div>
                    <div className="event-name">Event Name</div>
                  </button>
                </div> */}

                {/* end of events */}

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

      {/* <div className="days">
        <div className="day non-month-day old-month-day">
          <div className="day-header">
            <div className="week-name">Sun</div>
            <div className="day-number">28</div>
            <button className="add-event-btn">+</button>
          </div>
          <div className="events">
            <button className="all-day-event blue event">
              <div className="event-name">Short</div>
            </button>
            <button className="all-day-event green event">
              <div className="event-name">
                Long Event Name That Just Keeps Going
              </div>
            </button>
            <button className="event">
              <div className="color-dot blue"></div>
              <div className="event-time">7am</div>
              <div className="event-name">Event Name</div>
            </button>
          </div>
        </div>
        <div className="day non-month-day old-month-day">
          <div className="day-header">
            <div className="week-name">Mon</div>
            <div className="day-number">29</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day non-month-day old-month-day">
          <div className="day-header">
            <div className="week-name">Tue</div>
            <div className="day-number">30</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day non-month-day old-month-day">
          <div className="day-header">
            <div className="week-name">Wed</div>
            <div className="day-number">31</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day old-month-day">
          <div className="day-header">
            <div className="week-name">Thu</div>
            <div className="day-number">1</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day old-month-day">
          <div className="day-header">
            <div className="week-name">Fri</div>
            <div className="day-number">2</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day old-month-day">
          <div className="day-header">
            <div className="week-name">Sat</div>
            <div className="day-number">3</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day old-month-day">
          <div className="day-header">
            <div className="day-number">4</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day old-month-day">
          <div className="day-header">
            <div className="day-number">5</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day old-month-day">
          <div className="day-header">
            <div className="day-number">6</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day old-month-day">
          <div className="day-header">
            <div className="day-number">7</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day old-month-day">
          <div className="day-header">
            <div className="day-number">8</div>
            <button className="add-event-btn">+</button>
          </div>
          <div className="events">
            <button className="all-day-event blue event">
              <div className="event-name">Short</div>
            </button>
            <button className="all-day-event red event">
              <div className="event-name">
                Long Event Name That Just Keeps Going
              </div>
            </button>
            <button className="event">
              <div className="color-dot red"></div>
              <div className="event-time">7am</div>
              <div className="event-name">Event Name</div>
            </button>
          </div>
        </div>
        <div className="day old-month-day">
          <div className="day-header">
            <div className="day-number">9</div>
            <button className="add-event-btn">+</button>
          </div>
          <div className="events">
            <button className="all-day-event green event">
              <div className="event-name">Short</div>
            </button>
            <button className="event">
              <div className="color-dot blue"></div>
              <div className="event-time">7am</div>
              <div className="event-name">Event Name</div>
            </button>
            <button className="event">
              <div className="color-dot green"></div>
              <div className="event-time">8am</div>
              <div className="event-name">Event Name</div>
            </button>
            <button className="event">
              <div className="color-dot blue"></div>
              <div className="event-time">9am</div>
              <div className="event-name">Event Name</div>
            </button>
            <button className="event">
              <div className="color-dot blue"></div>
              <div className="event-time">10am</div>
              <div className="event-name">Event Name</div>
            </button>
            <button className="event">
              <div className="color-dot red"></div>
              <div className="event-time">11am</div>
              <div className="event-name">Event Name</div>
            </button>
          </div>
          <button className="events-view-more-btn">+2 More</button>
        </div>
        <div className="day old-month-day">
          <div className="day-header">
            <div className="day-number">10</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day old-month-day">
          <div className="day-header">
            <div className="day-number">11</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day old-month-day">
          <div className="day-header">
            <div className="day-number">12</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day old-month-day">
          <div className="day-header">
            <div className="day-number">13</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number today">14</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number">15</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number">16</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number">17</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number">18</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number">19</div>
            <button className="add-event-btn">+</button>
          </div>
          <div className="events">
            <button className="all-day-event blue event">
              <div className="event-name">Short</div>
            </button>
            <button className="all-day-event blue event">
              <div className="event-name">
                Long Event Name That Just Keeps Going
              </div>
            </button>
            <button className="event">
              <div className="color-dot blue"></div>
              <div className="event-time">7am</div>
              <div className="event-name">Event Name</div>
            </button>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number">20</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number">21</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number">22</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number">23</div>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number">24</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number">25</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number">26</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number">27</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number">28</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number">29</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day">
          <div className="day-header">
            <div className="day-number">30</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
        <div className="day non-month-day">
          <div className="day-header">
            <div className="day-number">1</div>
            <button className="add-event-btn">+</button>
          </div>
        </div>
      </div> */}
    </div>
  );
}
