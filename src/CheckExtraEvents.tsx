import { useLayoutEffect, useRef, useState } from "react";
import { EventType } from "./types";
import { format, parse } from "date-fns";

type CheckExtraEventsProps = {
  eventsToRender: EventType[];
  openModal: (event: EventType) => void;
  renderExtra: (amount: number) => React.ReactNode;
};

export default function CheckExtraEvents({
  eventsToRender,
  openModal,
  renderExtra,
}: CheckExtraEventsProps) {
  // console.log("🚀 ~ eventsForDay:", eventsForDay);
  const dayContainerRef = useRef<HTMLDivElement>(null);
  const [numberBelow, setNumberBelow] = useState(0);

  //   useDebugValue(numberBelow);
  // useLayoutEffect to see if events will overflow
  useLayoutEffect(() => {
    //exit if ref is null
    if (dayContainerRef.current == null) return;

    // start ResizeObserver
    const observer = new ResizeObserver((entries) => {
      const containerElement = entries[0]?.target;

      if (containerElement == null) return;
      const children =
        containerElement.querySelectorAll<HTMLElement>("[data-item]");
      //   console.log("🚀 ~ observer ~ children:", children);

      const overflowElement =
        containerElement.parentElement?.querySelector<HTMLElement>(
          "[data-overflow]"
        );
      //   console.log("🚀 ~ observer ~ overflowElement:", overflowElement);
      if (overflowElement != null) overflowElement.style.display = "none";
      children.forEach((child) => child.style.removeProperty("display"));
      let amount = 0;
      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        // console.log("scroll height: ", containerElement.scrollHeight);
        // console.log("client height: ", containerElement.clientHeight);
        if (containerElement.scrollHeight <= containerElement.clientHeight) {
          break;
        }
        amount = children.length - i;
        child.style.display = "none";
        overflowElement?.style.removeProperty("display");
      }
      setNumberBelow(amount);
      //   console.log("number below: ", numberBelow);
    });

    observer.observe(dayContainerRef.current);

    return () => observer.disconnect();
  }, [eventsToRender]);

  return (
    <>
      <div className="events" ref={dayContainerRef}>
        {eventsToRender.map((event: EventType) => {
          return (
            <div data-item key={event.id}>
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
      <div data-overflow>{renderExtra(numberBelow)}</div>
    </>
  );
}
