import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import FormGroup from "./FormGroup";

export default function AddEvent({
  isEventFormOpen,
  onClose,
  events,
  setEvents,
  isModalEdit,
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const allDay = watch("allDay");
  //   const nameRef = useRef("");
  //   const allDayRef = useRef(false);
  //   const startTimeRef = useRef("");
  //   const endTimeRef = useRef("");
  //   const colorRef = useRef("");

  //   const [name, setName] = useState("");
  //   const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [color, setColor] = useState("");

  function addEvent(data) {
    console.log("🚀 ~ file: AddEvent.tsx:30 ~ addEvent ~ data:", data);
    // e.preventDefault();

    const newEvent = {
      id: crypto.randomUUID(),
      name: data.name,
      allDay: data.allDay,
      startTime,
      endTime,
      color,
    };

    if (Array.isArray(events)) {
      setEvents([...events, newEvent]);
    } else {
      setEvents([[...events], newEvent]);
    }

    onClose();
    // setEvents([...events, newEvent]);
    // reset fields
    reset();
    setStartTime("");
    setEndTime("");
    setColor("");
  }

  function removeEvent() {}

  return createPortal(
    <div className={`${isEventFormOpen && "modal"}`}>
      <div className="overlay"></div>
      <div className="modal-body">
        <div className="modal-title">
          <div>Add Event</div>
          <small>6/8/23</small>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit(addEvent)}>
          <FormGroup
            classGroup={"form-group"}
            errorMessage={errors?.name?.message}
          >
            <label htmlFor="name">Name</label>
            <input
              type="text"
              //   name={name}
              id="name"
              //   onChange={(e) => setName(e.target.value)}
              {...register("name", {
                required: { value: true, message: "Required" },
              })}
            />
          </FormGroup>

          <div className="form-group checkbox">
            <label htmlFor="all-day">All Day?</label>
            {/* <input type="checkbox" id="all-day" {...register("allDay")} /> */}
            <Controller
              name="allDay"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <input type="checkbox" id="all-day" {...field} />
              )}
            />
          </div>
          <div className="row">
            <div className="form-group">
              <label htmlFor="start-time">Start Time</label>
              <input
                type="time"
                value={startTime}
                disabled={allDay}
                id="start-time"
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="end-time">End Time</label>
              <input
                type="time"
                value={endTime}
                disabled={allDay}
                id="end-time"
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Color</label>
            <div className="row left">
              <input
                type="radio"
                name="color"
                value="blue"
                id="blue"
                defaultChecked
                className="color-radio"
              />
              <label htmlFor="blue">
                <span className="sr-only">Blue</span>
              </label>
              <input
                type="radio"
                name="color"
                value="red"
                id="red"
                className="color-radio"
              />
              <label htmlFor="red">
                <span className="sr-only">Red</span>
              </label>
              <input
                type="radio"
                name="color"
                value="green"
                id="green"
                className="color-radio"
              />
              <label htmlFor="green">
                <span className="sr-only">Green</span>
              </label>
            </div>
          </div>
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
    document.querySelector("#modal-container")
  );
}
