import { format, parse } from "date-fns";
import ModalLogic, { ModalLogicProps } from "./ModalLogic";
import { EventType } from "./types";

type ViewMoreModalProps = {
  eventsForDay: EventType[];
  openModal: (event: EventType) => void;
} & Omit<ModalLogicProps, "children">;

// TODO: work on this - opening wrong dates etc - look at events being passed

export default function ViewMoreModal({
  eventsForDay,
  openModal,
  isOpen,
  onClose,
}: ViewMoreModalProps) {
  //   isOpen && console.log("🚀 ~ eventsForDay:", eventsForDay);

  return (
    <ModalLogic isOpen={isOpen} onClose={onClose}>
      <div className="modal-title">
        <small>{format(eventsForDay[0].date, "MM/dd/yy")}</small>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="events">
        {eventsForDay.map((event: EventType) => {
          //   console.log("event: ", event);
          return (
            <div key={event.id}>
              {/* all day event */}
              {event.allDay && (
                <button
                  className={`all-day-event
                    ${event.color == "blue" && "blue"} ${
                    event.color == "green" && "green"
                  } ${event.color == "red" && "red"} event`}
                  onClick={() => openModal(event)}
                >
                  <div className="event-name">{event.name}</div>
                </button>
              )}
              {/* NOT all day event */}
              {!event.allDay && (
                <button className="event" onClick={() => openModal(event)}>
                  <div
                    className={`color-dot ${event.color == "blue" && "blue"} ${
                      event.color == "green" && "green"
                    } ${event.color == "red" && "red"}`}
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
      </div>
    </ModalLogic>
  );
}
