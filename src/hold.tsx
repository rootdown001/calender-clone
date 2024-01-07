{
  events.map((event) => {
    if (event.date && date) {
      event.date.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      const date1 = event.date.getTime();
      const date2 = date.getTime();
      // console.log(date1 == date2);
      if (date1 == date2) {
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
                  className={`color-dot ${event.color == "blue" && "blue"} ${
                    event.color == "green" && "green"
                  } ${event.color == "red" && "red"}`}
                ></div>
                <div className="event-time">{event.startTime}</div>
                <div className="event-name">{event.name}</div>
              </button>
            )}
          </div>
        );
      }
      return null;
    }
    return null;
  });
}
