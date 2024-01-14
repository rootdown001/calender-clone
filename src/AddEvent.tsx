import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import FormGroup from "./FormGroup";
import { EventNoIdNoDate, AddEventProps, EventType } from "./types";
import { format } from "date-fns";

export default function AddEvent({
  dateOfEvent,
  isEventFormOpen,
  onClose,
  events,
  setEvents,
  isModalEdit,
  eventToPass,
}: AddEventProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EventNoIdNoDate | EventType>();

  const [allDayState, setAllDayState] = useState(false);
  const startTimeWatch = watch("startTime");

  // reset allDayState when isEventFormOpen or eventToPass changes
  useEffect(() => {
    isEventFormOpen && setAllDayState(false);
    eventToPass?.allDay && setAllDayState(true);
  }, [isEventFormOpen, eventToPass]);

  // function to add new event
  function addNewEvent(data: EventNoIdNoDate) {
    const newEvent = {
      id: crypto.randomUUID(),
      name: data.name,
      allDay: !!data.allDay,
      startTime: data.startTime,
      endTime: data.endTime,
      color: data.color,
    };

    // Add the new event to the events array
    setEvents([...events, { ...newEvent, date: dateOfEvent }]);
    // Reset the form fields and close the form
    reset();
    onClose();
  }

  // function to save an edited event
  function saveEditEvent(data: EventType) {
    setEvents(
      events.map((event) => {
        if (event.id === eventToPass?.id) {
          return {
            ...event,
            name: data.name,
            allDay: data.allDay,
            startTime: data.startTime,
            endTime: data.endTime,
            color: data.color,
          };
        }
        return event;
      })
    );
    // Reset the form fields and close the form
    reset();
    onClose();
  }

  // function to delete an edit event
  function deleteEditEvent() {
    setEvents(events.filter((event) => event.id !== eventToPass?.id));
    // Reset the form fields and close the form
    reset();
    onClose();
  }

  // function to handle form submissions
  function onSubmit(data: EventNoIdNoDate | EventType) {
    if (!isModalEdit) {
      addNewEvent(data as EventNoIdNoDate);
    } else {
      saveEditEvent(data as EventType);
    }
  }

  // create a portal to render the form outside of the main DOM tree
  return createPortal(
    <div className={`${isEventFormOpen && "modal"}`}>
      <div className="overlay"></div>
      <div className="modal-body">
        <div className="modal-title">
          <div>Add Event</div>
          <small>{format(dateOfEvent, "MM/dd/yy")}</small>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* form group for event name */}
          <FormGroup
            classGroup={"form-group"}
            errorMessage={errors?.name?.message}
          >
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              defaultValue={eventToPass !== undefined ? eventToPass.name : ""}
              {...register("name", {
                required: { value: true, message: "Required" },
              })}
            />
          </FormGroup>

          {/* form group for all day checkbox */}
          <FormGroup
            classGroup={"form-group checkbox"}
            errorMessage={errors?.allDay?.message}
          >
            <label htmlFor="all-day">All Day?</label>

            <input
              type="checkbox"
              id="all-day"
              defaultChecked={
                eventToPass !== undefined ? eventToPass.allDay : false
              }
              onClick={(e) => {
                const target = e.target as HTMLInputElement;
                setAllDayState(target.checked);
              }}
              {...register("allDay")}
            />
          </FormGroup>

          {/* form group for start and end times */}
          <div className="row">
            <FormGroup
              classGroup={"form-group"}
              errorMessage={errors?.startTime?.message}
            >
              <label htmlFor="start-time">Start Time</label>
              <input
                type="time"
                disabled={!!allDayState}
                id="start-time"
                defaultValue={
                  eventToPass !== undefined ? eventToPass.startTime : ""
                }
                {...register("startTime", {
                  required: { value: !allDayState, message: "Required" },
                })}
              />
            </FormGroup>

            <FormGroup
              classGroup={"form-group"}
              errorMessage={errors?.endTime?.message}
            >
              <label htmlFor="end-time">End Time</label>
              <input
                type="time"
                disabled={allDayState}
                id="end-time"
                defaultValue={
                  eventToPass !== undefined ? eventToPass.endTime : ""
                }
                {...register("endTime", {
                  required: { value: !allDayState, message: "Required" },
                  validate: (endTime) => {
                    if (!allDayState && endTime <= startTimeWatch) {
                      return "Invalid End Time";
                    }
                  },
                })}
              />
            </FormGroup>
          </div>

          {/* form group for event color */}
          <FormGroup
            classGroup={"form-group"}
            // errorMessage={errors?.color?.message}
          >
            <label>Color</label>
            <div className="row left">
              <input
                type="radio"
                value="blue"
                id="blue"
                defaultChecked={
                  !isModalEdit ? true : eventToPass?.color === "blue"
                }
                className="color-radio"
                {...register("color")}
              />
              <label htmlFor="blue">
                <span className="sr-only">Blue</span>
              </label>
              <input
                type="radio"
                value="red"
                id="red"
                defaultChecked={eventToPass?.color === "red"}
                className="color-radio"
                {...register("color")}
              />
              <label htmlFor="red">
                <span className="sr-only">Red</span>
              </label>
              <input
                type="radio"
                value="green"
                id="green"
                defaultChecked={eventToPass?.color === "green"}
                className="color-radio"
                {...register("color")}
              />
              <label htmlFor="green">
                <span className="sr-only">Green</span>
              </label>
            </div>
          </FormGroup>

          {/* form submission buttons */}
          <div className="row">
            <button className="btn btn-success" type="submit">
              {isModalEdit ? "Save" : "Add"}
            </button>
            {isModalEdit && (
              <button
                className="btn btn-delete"
                type="button"
                onClick={() => deleteEditEvent()}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>,
    document.querySelector("#modal-container")!
  );
}
