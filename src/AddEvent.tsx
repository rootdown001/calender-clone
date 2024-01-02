import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import FormGroup from "./FormGroup";
import { EventType, EventTypeNoDate } from "./types";
import { EventNoIdNoDate } from "./types";
import { format } from "date-fns";

type AddEventProps = {
  dateOfEvent: Date;
  isEventFormOpen: boolean;
  onClose: () => void;
  events: EventType[];
  setEvents: Dispatch<SetStateAction<EventType[]>>;
  isModalEdit: boolean;
};

export default function AddEvent({
  dateOfEvent,
  isEventFormOpen,
  onClose,
  events,
  setEvents,
  isModalEdit,
}: AddEventProps) {
  // set up useForm for handling

  // console.log("dateOfEvent: ", dateOfEvent);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EventNoIdNoDate>();

  const [allDayState, setAllDayState] = useState(false);

  // reset allDayState when isEventFormOpen changes
  useEffect(() => {
    isEventFormOpen && setAllDayState(false);
  }, [isEventFormOpen]);

  // console.log("allDayState: ", allDayState);

  const startTimeWatch = watch("startTime");

  function addNewEvent(data: EventNoIdNoDate) {
    // console.log("🚀 ~ file: AddEvent.tsx:30 ~ addNewEvent ~ data:", data);

    // create new event object
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
        <form onSubmit={handleSubmit(addNewEvent)}>
          {/* Form inputs */}
          <FormGroup
            classGroup={"form-group"}
            errorMessage={errors?.name?.message}
          >
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              {...register("name", {
                required: { value: true, message: "Required" },
              })}
            />
          </FormGroup>
          <FormGroup
            classGroup={"form-group checkbox"}
            errorMessage={errors?.allDay?.message}
          >
            <label htmlFor="all-day">All Day?</label>

            <input
              type="checkbox"
              id="all-day"
              defaultChecked={false}
              onClick={(e) => {
                const target = e.target as HTMLInputElement;
                setAllDayState(target.checked);
              }}
              {...register("allDay")}
            />
          </FormGroup>

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
                defaultChecked
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
                className="color-radio"
                {...register("color")}
              />
              <label htmlFor="green">
                <span className="sr-only">Green</span>
              </label>
            </div>
          </FormGroup>
          {/* <FormGroup>
            <input
              type="date"
              {...register("date")}
              value={format(dateOfEvent, "MM")}
              style={{ display: "none" }}
            />
          </FormGroup> */}
          <div className="row">
            <button className="btn btn-success" type="submit">
              Add
            </button>
            {isModalEdit && (
              <button className="btn btn-delete" type="button">
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
